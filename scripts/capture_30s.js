import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('public/projects');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper: Mandatory 30-second sleep with countdown logging
async function waitMandatory30Seconds(label) {
  console.log(`[${label}] === STARTING MANDATORY 30-SECOND WAITING PERIOD ===`);
  const totalSeconds = 30;
  for (let elapsed = 0; elapsed < totalSeconds; elapsed += 5) {
    const remaining = totalSeconds - elapsed;
    console.log(`[${label}] Mandatory wait: ${elapsed}s elapsed, ${remaining}s remaining...`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  console.log(`[${label}] === 30 FULL SECONDS COMPLETED. Ready to capture ===`);
}

// Helper: Decode visible images
async function decodeVisibleImages(page, label) {
  try {
    const count = await page.evaluate(async () => {
      if (document.fonts) {
        try { await document.fonts.ready; } catch (e) {}
      }
      const imgs = Array.from(document.querySelectorAll('img')).filter((img) => {
        const r = img.getBoundingClientRect();
        return (
          r.width > 0 &&
          r.height > 0 &&
          r.bottom >= -50 &&
          r.top <= window.innerHeight + 100
        );
      });

      for (const img of imgs) {
        if (img.loading === 'lazy') img.loading = 'eager';
        if (typeof img.decode === 'function' && img.src) {
          try {
            await Promise.race([
              img.decode(),
              new Promise((r) => setTimeout(r, 1500))
            ]);
          } catch (e) {}
        }
      }
      return imgs.filter((i) => i.complete && i.naturalWidth > 0).length;
    });
    console.log(`[${label}] Fully decoded visible images: ${count}`);
  } catch (err) {
    console.log(`[${label}] Image decode note:`, err.message);
  }
}

async function run() {
  console.log('===============================================================');
  console.log('MANDATORY 30-SECOND DELAY SCREENSHOT CAPTURE PROCESS');
  console.log('Target Website: https://alahadattars.com/');
  console.log('===============================================================\n');

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
    // =========================================================================
    // 1. Homepage Hero (Desktop 1440x900)
    // =========================================================================
    console.log('\n>>> [1/5] VIEW: Homepage Hero');
    const heroPage = await browser.newPage();
    await heroPage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    );
    await heroPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    console.log('[Homepage Hero] Navigating to https://alahadattars.com/ ...');
    await heroPage.goto('https://alahadattars.com/', { waitUntil: 'load', timeout: 60000 }).catch(async () => {
      console.log('[Homepage Hero] "load" event timeout, continuing with domcontentloaded...');
      await heroPage.goto('https://alahadattars.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    });

    // Slight scroll to trigger IntersectionObservers, then back to top
    await heroPage.evaluate(() => window.scrollBy(0, 300));
    await new Promise((r) => setTimeout(r, 500));
    await heroPage.evaluate(() => window.scrollTo(0, 0));

    // Mandatory 30-second waiting period
    await waitMandatory30Seconds('Homepage Hero');

    // Decode and capture
    await decodeVisibleImages(heroPage, 'Homepage Hero');
    const heroPath = path.join(OUTPUT_DIR, 'al-ahad-hero.jpg');
    await heroPage.screenshot({ path: heroPath, type: 'jpeg', quality: 95 });
    console.log(`[Homepage Hero] Saved: ${heroPath} (${fs.statSync(heroPath).size} bytes)`);

    // Sync to primary thumbnail
    const thumbPath = path.join(OUTPUT_DIR, 'al-ahad-attars.jpg');
    fs.copyFileSync(heroPath, thumbPath);
    console.log(`[Homepage Hero] Synced to: ${thumbPath}`);

    await heroPage.close();

    // =========================================================================
    // 2. Catalog & Collections (Desktop 1440x900)
    // =========================================================================
    console.log('\n>>> [2/5] VIEW: Catalog & Collections');
    const collectionPage = await browser.newPage();
    await collectionPage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    );
    await collectionPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    console.log('[Catalog & Collections] Navigating to https://alahadattars.com/collections ...');
    await collectionPage.goto('https://alahadattars.com/collections', { waitUntil: 'load', timeout: 60000 }).catch(async () => {
      console.log('[Catalog & Collections] "load" event timeout, continuing with domcontentloaded...');
      await collectionPage.goto('https://alahadattars.com/collections', { waitUntil: 'domcontentloaded', timeout: 30000 });
    });

    // Scroll through product cards so lazy images begin rendering
    await collectionPage.evaluate(() => window.scrollBy(0, 400));
    await new Promise((r) => setTimeout(r, 500));

    // Mandatory 30-second waiting period
    await waitMandatory30Seconds('Catalog & Collections');

    // Decode and capture
    await decodeVisibleImages(collectionPage, 'Catalog & Collections');
    const collectionPath = path.join(OUTPUT_DIR, 'al-ahad-collection.jpg');
    await collectionPage.screenshot({ path: collectionPath, type: 'jpeg', quality: 95 });
    console.log(`[Catalog & Collections] Saved: ${collectionPath} (${fs.statSync(collectionPath).size} bytes)`);

    await collectionPage.close();

    // =========================================================================
    // 3. Product Page (Desktop 1440x900)
    // =========================================================================
    console.log('\n>>> [3/5] VIEW: Product Page (Oud Wood)');
    const productPage = await browser.newPage();
    await productPage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    );
    await productPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    console.log('[Product Page] Navigating to https://alahadattars.com/product/173?type=attar ...');
    await productPage.goto('https://alahadattars.com/product/173?type=attar', { waitUntil: 'load', timeout: 60000 }).catch(async () => {
      console.log('[Product Page] "load" event timeout, continuing with domcontentloaded...');
      await productPage.goto('https://alahadattars.com/product/173?type=attar', { waitUntil: 'domcontentloaded', timeout: 30000 });
    });

    await productPage.evaluate(() => window.scrollTo(0, 0));

    // Mandatory 30-second waiting period
    await waitMandatory30Seconds('Product Page');

    // Decode and capture
    await decodeVisibleImages(productPage, 'Product Page');
    const productPath = path.join(OUTPUT_DIR, 'al-ahad-product.jpg');
    await productPage.screenshot({ path: productPath, type: 'jpeg', quality: 95 });
    console.log(`[Product Page] Saved: ${productPath} (${fs.statSync(productPath).size} bytes)`);

    await productPage.close();

    // =========================================================================
    // 4. Cart & Bag (Desktop 1440x900)
    // =========================================================================
    console.log('\n>>> [4/5] VIEW: Cart & Bag');
    const cartPage = await browser.newPage();
    await cartPage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    );
    await cartPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    console.log('[Cart & Bag] Navigating to https://alahadattars.com/cart ...');
    await cartPage.goto('https://alahadattars.com/cart', { waitUntil: 'load', timeout: 60000 }).catch(async () => {
      console.log('[Cart & Bag] "load" event timeout, continuing with domcontentloaded...');
      await cartPage.goto('https://alahadattars.com/cart', { waitUntil: 'domcontentloaded', timeout: 30000 });
    });

    // Mandatory 30-second waiting period
    await waitMandatory30Seconds('Cart & Bag');

    // Decode and capture
    await decodeVisibleImages(cartPage, 'Cart & Bag');
    const cartPath = path.join(OUTPUT_DIR, 'al-ahad-cart.jpg');
    await cartPage.screenshot({ path: cartPath, type: 'jpeg', quality: 95 });
    console.log(`[Cart & Bag] Saved: ${cartPath} (${fs.statSync(cartPath).size} bytes)`);

    await cartPage.close();

    // =========================================================================
    // 5. Mobile Experience (iPhone 14: 390x844)
    // =========================================================================
    console.log('\n>>> [5/5] VIEW: Mobile Experience');
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

    console.log('[Mobile Experience] Navigating to https://alahadattars.com/ ...');
    await mobilePage.goto('https://alahadattars.com/', { waitUntil: 'load', timeout: 60000 }).catch(async () => {
      console.log('[Mobile Experience] "load" event timeout, continuing with domcontentloaded...');
      await mobilePage.goto('https://alahadattars.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    });

    // Slight scroll to trigger mobile observer, then back to top
    await mobilePage.evaluate(() => window.scrollBy(0, 200));
    await new Promise((r) => setTimeout(r, 400));
    await mobilePage.evaluate(() => window.scrollTo(0, 0));

    // Mandatory 30-second waiting period
    await waitMandatory30Seconds('Mobile Experience');

    // Decode and capture
    await decodeVisibleImages(mobilePage, 'Mobile Experience');
    const mobilePath = path.join(OUTPUT_DIR, 'al-ahad-mobile.jpg');
    await mobilePage.screenshot({ path: mobilePath, type: 'jpeg', quality: 95 });
    console.log(`[Mobile Experience] Saved: ${mobilePath} (${fs.statSync(mobilePath).size} bytes)`);

    await mobilePage.close();

    console.log('\n===============================================================');
    console.log('ALL 5 VIEWS COMPLETED WITH MANDATORY 30-SECOND WAITS!');
    console.log('===============================================================');
  } catch (err) {
    console.error('Capture process error:', err);
  } finally {
    await browser.close();
  }
}

run();

