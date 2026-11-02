import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('public/projects');

async function run() {
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
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    console.log('Visiting homepage...');
    await page.goto('https://alahadattars.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));

    // Get all links
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href
      })).filter(l => l.href.startsWith('http'));
    });

    console.log('Interesting links:', links.filter(l => 
      /collection|attar|perfume|product|shop/i.test(l.href) || 
      /collection|attar|perfume|product|shop/i.test(l.text)
    ).slice(0, 20));

    // 1. Capture Hero (clean top section)
    console.log('Capturing hero...');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'al-ahad-hero.jpg'),
      type: 'jpeg',
      quality: 92
    });
    // Main featured image
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'al-ahad-attars.jpg'),
      type: 'jpeg',
      quality: 92
    });

    // 2. Scroll to featured collection / products on homepage
    console.log('Scrolling to homepage products/collections...');
    await page.evaluate(() => window.scrollBy(0, 950));
    await new Promise(r => setTimeout(r, 2500));
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'al-ahad-collection.jpg'),
      type: 'jpeg',
      quality: 92
    });

    // 3. Navigate to a dedicated collection or product page
    // Let's see if there is an attars or collections page
    const collectionLink = links.find(l => /collections|attars/i.test(l.href) && !l.href.endsWith('#'));
    const productLink = links.find(l => /product|item/i.test(l.href) || /\/p\//i.test(l.href));

    let prodUrl = productLink ? productLink.href : null;

    if (collectionLink) {
      console.log('Navigating to collection page:', collectionLink.href);
      await page.goto(collectionLink.href, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 4000));
      
      // If we didn't have a product link yet, find one here
      if (!prodUrl) {
        const prodLinksOnCollection = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => 
            /product/i.test(h) || (h.startsWith('https://alahadattars.com') && !h.includes('collection') && h.split('/').length > 4)
          );
        });
        if (prodLinksOnCollection.length > 0) prodUrl = prodLinksOnCollection[0];
      }
    }

    // 4. Product Details page
    if (!prodUrl) {
      // Find any clickable product card
      const anyProd = links.find(l => l.href.startsWith('https://alahadattars.com/') && l.href !== 'https://alahadattars.com/' && !l.href.includes('#'));
      if (anyProd) prodUrl = anyProd.href;
    }

    if (prodUrl) {
      console.log('Navigating to product details page:', prodUrl);
      await page.goto(prodUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 4000));
      await page.screenshot({
        path: path.join(OUTPUT_DIR, 'al-ahad-product.jpg'),
        type: 'jpeg',
        quality: 92
      });
      console.log('Captured al-ahad-product.jpg');

      // 5. Try opening Cart / Checkout
      console.log('Looking for Add to Cart or Cart button...');
      try {
        const cartOpened = await page.evaluate(() => {
          // Look for shopping bag or cart icon or Add to Cart
          const buttons = Array.from(document.querySelectorAll('button, a'));
          const addBtn = buttons.find(b => /add to cart|add|buy now/i.test(b.innerText || ''));
          if (addBtn) {
            addBtn.click();
            return true;
          }
          const cartIcon = buttons.find(b => /cart|bag|shopping/i.test(b.getAttribute('aria-label') || '') || b.querySelector('svg, i, .fa-shopping-bag, .icon-cart'));
          if (cartIcon) {
            cartIcon.click();
            return true;
          }
          return false;
        });

        if (cartOpened) {
          console.log('Cart trigger clicked, waiting...');
          await new Promise(r => setTimeout(r, 3000));
          await page.screenshot({
            path: path.join(OUTPUT_DIR, 'al-ahad-cart.jpg'),
            type: 'jpeg',
            quality: 92
          });
          console.log('Captured al-ahad-cart.jpg');
        } else {
          // Go to /cart directly if exists
          console.log('Trying /cart directly...');
          await page.goto('https://alahadattars.com/cart', { waitUntil: 'domcontentloaded', timeout: 15000 });
          await new Promise(r => setTimeout(r, 3000));
          await page.screenshot({
            path: path.join(OUTPUT_DIR, 'al-ahad-cart.jpg'),
            type: 'jpeg',
            quality: 92
          });
          console.log('Captured al-ahad-cart.jpg via /cart');
        }
      } catch (e) {
        console.log('Cart capture fallback note:', e.message);
      }
    }

    // 6. Mobile View (iPhone 14 / modern smartphone 390x844)
    console.log('Capturing mobile view...');
    const mobilePage = await browser.newPage();
    await mobilePage.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await mobilePage.goto('https://alahadattars.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
    await mobilePage.screenshot({
      path: path.join(OUTPUT_DIR, 'al-ahad-mobile.jpg'),
      type: 'jpeg',
      quality: 92
    });
    console.log('Captured al-ahad-mobile.jpg');

    console.log('All captures complete!');
  } catch (err) {
    console.error('Error in capture sequence:', err);
  } finally {
    await browser.close();
  }
}

run();
