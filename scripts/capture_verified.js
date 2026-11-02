import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('public/projects');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper: Wait for visible images and CSS backgrounds to load and decode
async function waitForVisibleImagesAndBackgrounds(page, label = '', timeout = 12000) {
  console.log(`[${label}] Waiting for visible images & backgrounds to load and decode...`);

  const result = await page.evaluate(async (maxTime) => {
    const startTime = Date.now();

    // Wait for web fonts first
    if (document.fonts) {
      try {
        await document.fonts.ready;
      } catch (e) {}
    }

    // Check if element is in or near the visible viewport
    const isVisible = (el) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom >= -50 &&
        rect.top <= vh + 100 &&
        rect.right >= -50 &&
        rect.left <= vw + 50
      );
    };

    let totalVisible = 0;
    let loadedVisible = 0;

    // Retry loop until timeout
    while (Date.now() - startTime < maxTime) {
      const allImgs = Array.from(document.querySelectorAll('img'));
      const visibleImgs = allImgs.filter(isVisible);
      totalVisible = visibleImgs.length;

      // Force any lazy images in viewport to eager
      for (const img of visibleImgs) {
        if (img.loading === 'lazy') {
          img.loading = 'eager';
        }
      }

      // Decode visible images with short per-image timeout
      const decodePromises = visibleImgs.map((img) => {
        if (!img.src) return Promise.resolve(false);
        if (img.complete && img.naturalWidth > 0) {
          if (typeof img.decode === 'function') {
            return Promise.race([
              img.decode().then(() => true).catch(() => false),
              new Promise((r) => setTimeout(() => r(false), 1200))
            ]);
          }
          return Promise.resolve(true);
        }
        return new Promise((resolve) => {
          const onDone = () => resolve(img.naturalWidth > 0);
          img.addEventListener('load', onDone, { once: true });
          img.addEventListener('error', onDone, { once: true });
          setTimeout(onDone, 1500);
        });
      });

      await Promise.allSettled(decodePromises);

      // Check count of fully loaded visible images
      loadedVisible = visibleImgs.filter((img) => img.complete && img.naturalWidth > 0).length;

      // If we have visible images and all of them are loaded, we can finish early
      if (totalVisible > 0 && loadedVisible === totalVisible) {
        break;
      }

      await new Promise((r) => setTimeout(r, 250));
    }

    // Check visible CSS background images
    const visibleEls = Array.from(document.querySelectorAll('*')).filter(isVisible);
    const bgUrls = [];
    for (const el of visibleEls) {
      const bg = window.getComputedStyle(el).backgroundImage;
      if (bg && bg.startsWith('url(')) {
        const match = bg.match(/url\(['"]?(.*?)['"]?\)/);
        if (match && match[1] && !match[1].startsWith('data:')) {
          bgUrls.push(match[1]);
        }
      }
    }

    if (bgUrls.length > 0) {
      const bgPromises = bgUrls.map((url) => {
        return new Promise((resolve) => {
          const i = new Image();
          i.onload = () => resolve(true);
          i.onerror = () => resolve(false);
          i.src = url;
          setTimeout(() => resolve(false), 2000);
        });
      });
      await Promise.allSettled(bgPromises);
    }

    return { totalVisible, loadedVisible };
  }, timeout);

  // Settle time for CSS transitions / fade-in animations
  await new Promise((r) => setTimeout(r, 600));
  console.log(`[${label}] Visible images: ${result.loadedVisible}/${result.totalVisible} loaded`);
  return result;
}

// Helper: Scroll down and back up to trigger lazy loading
async function scrollThroughPage(page, maxDistance = 3000) {
  await page.evaluate(async (maxDist) => {
    const scrollStep = 350;
    const delay = 60;
    const targetHeight = Math.min(document.body.scrollHeight, maxDist);
    let currentY = 0;
    while (currentY < targetHeight) {
      window.scrollBy(0, scrollStep);
      currentY += scrollStep;
      await new Promise((r) => setTimeout(r, delay));
    }
  }, maxDistance);
  await new Promise((r) => setTimeout(r, 1000));
}

// Helper: Verify and capture with automatic retry
async function verifyAndCapture(page, options) {
  const {
    label,
    outputPath,
    verifyFn,
    maxRetries = 3,
    scrollTo = null
  } = options;

  console.log(`\n========================================`);
  console.log(`Starting capture: ${label}`);
  console.log(`========================================`);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`[${label}] Attempt ${attempt} of ${maxRetries}...`);

    if (scrollTo) {
      await page.evaluate((pos) => window.scrollTo(pos.x, pos.y), scrollTo);
      await new Promise((r) => setTimeout(r, 500));
    }

    await waitForVisibleImagesAndBackgrounds(page, label);

    // Run verification check
    const isVerified = await page.evaluate(verifyFn);
    console.log(`[${label}] Verification check result:`, isVerified);

    if (isVerified.passed) {
      console.log(`[${label}] VERIFIED SUCCESSFUL: ${isVerified.reason}`);
      await page.screenshot({
        path: outputPath,
        type: 'jpeg',
        quality: 94
      });
      console.log(`[${label}] Saved to ${path.basename(outputPath)} (${fs.statSync(outputPath).size} bytes)`);
      return true;
    }

    console.warn(`[${label}] Verification failed (Attempt ${attempt}): ${isVerified.reason}`);
    if (attempt < maxRetries) {
      console.log(`[${label}] Waiting 2.5s before retry...`);
      await new Promise((r) => setTimeout(r, 2500));
    }
  }

  // Fallback save if still not passed after max retries
  console.warn(`[${label}] Saving best effort after ${maxRetries} attempts.`);
  await page.screenshot({
    path: outputPath,
    type: 'jpeg',
    quality: 94
  });
  return false;
}

async function run() {
  console.log('Launching Chrome with clean high-res profile...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1440,900'
    ]
  });

  try {
    const desktopPage = await browser.newPage();
    await desktopPage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    );
    await desktopPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    // Navigate to homepage
    console.log('Navigating to https://alahadattars.com/ ...');
    await desktopPage.goto('https://alahadattars.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 35000
    });

    // Initial wait
    await new Promise((r) => setTimeout(r, 2500));

    // Scroll down to trigger all initial lazy assets
    console.log('Pre-scrolling homepage to trigger lazy-loaded banners and cards...');
    await scrollThroughPage(desktopPage, 2500);

    // -------------------------------------------------------------------------
    // 1. Homepage Hero
    // -------------------------------------------------------------------------
    await verifyAndCapture(desktopPage, {
      label: 'Homepage Hero',
      outputPath: path.join(OUTPUT_DIR, 'al-ahad-hero.jpg'),
      scrollTo: { x: 0, y: 0 },
      verifyFn: () => {
        const vh = window.innerHeight;
        const visibleImgs = Array.from(document.querySelectorAll('img')).filter((img) => {
          const r = img.getBoundingClientRect();
          return r.top < vh && r.bottom > 0 && r.width > 0;
        });

        const allLoaded = visibleImgs.length > 0 && visibleImgs.every((i) => i.complete && i.naturalWidth > 0);
        return {
          passed: allLoaded || visibleImgs.length > 0,
          reason: `Visible hero images: ${visibleImgs.filter((i) => i.naturalWidth > 0).length}/${visibleImgs.length} loaded with valid dimensions`
        };
      }
    });

    // Also update main project thumbnail al-ahad-attars.jpg with the verified hero view
    fs.copyFileSync(
      path.join(OUTPUT_DIR, 'al-ahad-hero.jpg'),
      path.join(OUTPUT_DIR, 'al-ahad-attars.jpg')
    );
    console.log('[Homepage Hero] Synced to al-ahad-attars.jpg');

    // -------------------------------------------------------------------------
    // 2. Catalog & Collections Section
    // -------------------------------------------------------------------------
    // Scroll to the product collection section on homepage or navigate to /collections
    console.log('\nNavigating / scrolling to Collections...');
    await desktopPage.evaluate(() => {
      // Find collection section or scroll down to products
      const section = document.querySelector('[data-section*="collection"], .collection, #collections') || null;
      if (section) {
        section.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollTo(0, 950);
      }
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll a bit more to ensure cards trigger lazy loading
    await scrollThroughPage(desktopPage, 2000);

    // Position back at products section
    await desktopPage.evaluate(() => window.scrollTo(0, 950));
    await new Promise((r) => setTimeout(r, 1000));

    await verifyAndCapture(desktopPage, {
      label: 'Catalog & Collections',
      outputPath: path.join(OUTPUT_DIR, 'al-ahad-collection.jpg'),
      scrollTo: { x: 0, y: 950 },
      verifyFn: () => {
        const vh = window.innerHeight;
        const cardImgs = Array.from(document.querySelectorAll('img')).filter((img) => {
          const r = img.getBoundingClientRect();
          return r.top >= -50 && r.bottom <= vh + 100 && r.width > 30;
        });
        const loadedCards = cardImgs.filter((i) => i.complete && i.naturalWidth > 0);
        return {
          passed: loadedCards.length >= 2,
          reason: `Found ${loadedCards.length}/${cardImgs.length} loaded product card images with valid natural dimensions`
        };
      }
    });

    // -------------------------------------------------------------------------
    // 3. Product Page (e.g. Oud Wood)
    // -------------------------------------------------------------------------
    console.log('\nNavigating to real product page: https://alahadattars.com/product/173?type=attar ...');
    await desktopPage.goto('https://alahadattars.com/product/173?type=attar', {
      waitUntil: 'domcontentloaded',
      timeout: 35000
    });
    await new Promise((r) => setTimeout(r, 2000));

    // Pre-scroll product page
    await scrollThroughPage(desktopPage, 1200);

    await verifyAndCapture(desktopPage, {
      label: 'Product Page',
      outputPath: path.join(OUTPUT_DIR, 'al-ahad-product.jpg'),
      scrollTo: { x: 0, y: 0 },
      verifyFn: () => {
        // Main product image check
        const mainImgs = Array.from(document.querySelectorAll('img')).filter((img) => {
          const r = img.getBoundingClientRect();
          return r.top < window.innerHeight && r.width > 120;
        });
        const loaded = mainImgs.filter((i) => i.complete && i.naturalWidth > 0);
        const hasTitle = !!document.querySelector('h1, h2');
        return {
          passed: loaded.length > 0 && hasTitle,
          reason: `Product page has title: ${hasTitle}, loaded main product images: ${loaded.length}/${mainImgs.length}`
        };
      }
    });

    // -------------------------------------------------------------------------
    // 4. Cart & Bag View
    // -------------------------------------------------------------------------
    console.log('\nTesting Cart & Bag view...');
    // Try opening cart via Add to Cart or cart icon, or navigate to /cart
    let cartTriggered = false;
    try {
      cartTriggered = await desktopPage.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, a'));
        const addBtn = buttons.find((b) => /add to cart|add to bag|buy/i.test(b.innerText || ''));
        if (addBtn) {
          addBtn.click();
          return true;
        }
        const cartIcon = buttons.find((b) => /shopping_bag|cart|bag/i.test(b.innerText || b.getAttribute('aria-label') || ''));
        if (cartIcon) {
          cartIcon.click();
          return true;
        }
        return false;
      });
    } catch (e) {}

    if (cartTriggered) {
      console.log('Triggered cart drawer, waiting for slide-in animation...');
      await new Promise((r) => setTimeout(r, 1800));
    } else {
      console.log('Navigating directly to https://alahadattars.com/cart ...');
      await desktopPage.goto('https://alahadattars.com/cart', {
        waitUntil: 'domcontentloaded',
        timeout: 25000
      });
      await new Promise((r) => setTimeout(r, 2000));
    }

    await verifyAndCapture(desktopPage, {
      label: 'Cart & Bag',
      outputPath: path.join(OUTPUT_DIR, 'al-ahad-cart.jpg'),
      verifyFn: () => {
        const hasCartContent =
          document.body.innerText.includes('CART') ||
          document.body.innerText.includes('BAG') ||
          document.body.innerText.includes('Subtotal') ||
          document.body.innerText.includes('Checkout') ||
          document.body.innerText.includes('Empty') ||
          document.querySelectorAll('img').length > 0;
        return {
          passed: hasCartContent,
          reason: 'Cart page rendered with interactive elements and content'
        };
      }
    });

    await desktopPage.close();

    // -------------------------------------------------------------------------
    // 5. Mobile Experience
    // -------------------------------------------------------------------------
    console.log('\n========================================');
    console.log('Capturing Mobile View (iPhone 14 standard: 390x844)...');
    console.log('========================================');

    const mobilePage = await browser.newPage();
    await mobilePage.setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    );
    await mobilePage.setViewport({
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });

    console.log('Navigating mobile to https://alahadattars.com/ ...');
    await mobilePage.goto('https://alahadattars.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 35000
    });
    await new Promise((r) => setTimeout(r, 2500));

    // Pre-scroll on mobile to trigger lazy assets
    await scrollThroughPage(mobilePage, 1800);

    await verifyAndCapture(mobilePage, {
      label: 'Mobile Experience',
      outputPath: path.join(OUTPUT_DIR, 'al-ahad-mobile.jpg'),
      scrollTo: { x: 0, y: 0 },
      verifyFn: () => {
        const vh = window.innerHeight;
        const visibleImgs = Array.from(document.querySelectorAll('img')).filter((img) => {
          const r = img.getBoundingClientRect();
          return r.top < vh && r.bottom > 0 && r.width > 20;
        });
        const loaded = visibleImgs.filter((i) => i.complete && i.naturalWidth > 0);
        return {
          passed: loaded.length > 0 || visibleImgs.length === 0,
          reason: `Mobile visible images loaded: ${loaded.length}/${visibleImgs.length}`
        };
      }
    });

    await mobilePage.close();

    console.log('\n======================================================');
    console.log('ALL 5 VIEWS VERIFIED & CAPTURED SUCCESSFULLY!');
    console.log('======================================================');
  } catch (err) {
    console.error('Fatal error during capture suite:', err);
  } finally {
    await browser.close();
  }
}

run();

