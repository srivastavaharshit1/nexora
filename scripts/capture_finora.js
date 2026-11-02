import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('public/projects');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function waitAndDecode(page, label = '') {
  console.log(`[${label}] Waiting for fonts and images to load & decode...`);
  await page.evaluate(async () => {
    if (document.fonts) {
      try { await document.fonts.ready; } catch (e) {}
    }
    const imgs = Array.from(document.querySelectorAll('img'));
    for (const img of imgs) {
      if (img.loading === 'lazy') img.loading = 'eager';
      if (typeof img.decode === 'function' && img.src) {
        try {
          await Promise.race([
            img.decode(),
            new Promise(r => setTimeout(r, 1500))
          ]);
        } catch (e) {}
      }
    }
  });
  await new Promise(r => setTimeout(r, 1200));
}

async function run() {
  console.log('===============================================================');
  console.log('CAPTURING REAL FINORA PROJECT SCREENSHOTS FROM LOCALHOST:5178');
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
    // -------------------------------------------------------------------------
    // 1. Homepage Hero (1440x900)
    // -------------------------------------------------------------------------
    console.log('\n>>> [1/5] VIEW: Finora Homepage Hero');
    const heroPage = await browser.newPage();
    await heroPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await heroPage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    );

    console.log('Navigating to http://localhost:5178/ ...');
    await heroPage.goto('http://localhost:5178/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Slight scroll to trigger animations, then back to top
    await heroPage.evaluate(() => window.scrollBy(0, 300));
    await new Promise(r => setTimeout(r, 600));
    await heroPage.evaluate(() => window.scrollTo(0, 0));

    await waitAndDecode(heroPage, 'Finora Hero');

    const heroPath = path.join(OUTPUT_DIR, 'finora-hero.jpg');
    await heroPage.screenshot({ path: heroPath, type: 'jpeg', quality: 95 });
    console.log(`Saved: ${heroPath} (${fs.statSync(heroPath).size} bytes)`);

    // Sync to primary finora.jpg thumbnail
    const mainThumb = path.join(OUTPUT_DIR, 'finora.jpg');
    fs.copyFileSync(heroPath, mainThumb);
    console.log(`Synced to main thumbnail: ${mainThumb}`);

    // -------------------------------------------------------------------------
    // 2. Collection Showcase (Homepage collections section)
    // -------------------------------------------------------------------------
    console.log('\n>>> [2/5] VIEW: Finora Shop by Collection / The Finora Edit');
    await heroPage.evaluate(() => {
      // Find "SHOP BY COLLECTION" or scroll to it
      const headings = Array.from(document.querySelectorAll('h2, h3'));
      const colHeading = headings.find(h => /collection/i.test(h.innerText));
      if (colHeading) {
        colHeading.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollTo(0, 900);
      }
    });
    await new Promise(r => setTimeout(r, 1500));
    await waitAndDecode(heroPage, 'Finora Collection');

    const colPath = path.join(OUTPUT_DIR, 'finora-collection.jpg');
    await heroPage.screenshot({ path: colPath, type: 'jpeg', quality: 95 });
    console.log(`Saved: ${colPath} (${fs.statSync(colPath).size} bytes)`);

    await heroPage.close();

    // -------------------------------------------------------------------------
    // 3. Shop All Catalog (http://localhost:5178/shop)
    // -------------------------------------------------------------------------
    console.log('\n>>> [3/5] VIEW: Finora Shop All Catalog');
    const shopPage = await browser.newPage();
    await shopPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await shopPage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    );

    console.log('Navigating to http://localhost:5178/shop ...');
    await shopPage.goto('http://localhost:5178/shop', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    await waitAndDecode(shopPage, 'Finora Shop');

    const shopPath = path.join(OUTPUT_DIR, 'finora-shop.jpg');
    await shopPage.screenshot({ path: shopPath, type: 'jpeg', quality: 95 });
    console.log(`Saved: ${shopPath} (${fs.statSync(shopPath).size} bytes)`);

    await shopPage.close();

    // -------------------------------------------------------------------------
    // 4. Custom Commission Orders (http://localhost:5178/custom)
    // -------------------------------------------------------------------------
    console.log('\n>>> [4/5] VIEW: Finora Bespoke Custom Orders');
    const customPage = await browser.newPage();
    await customPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await customPage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    );

    console.log('Navigating to http://localhost:5178/custom ...');
    await customPage.goto('http://localhost:5178/custom', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    await waitAndDecode(customPage, 'Finora Custom');

    const customPath = path.join(OUTPUT_DIR, 'finora-custom.jpg');
    await customPage.screenshot({ path: customPath, type: 'jpeg', quality: 95 });
    console.log(`Saved: ${customPath} (${fs.statSync(customPath).size} bytes)`);

    await customPage.close();

    // -------------------------------------------------------------------------
    // 5. Mobile Experience (iPhone 14: 390x844)
    // -------------------------------------------------------------------------
    console.log('\n>>> [5/5] VIEW: Finora Mobile Experience (iPhone 14)');
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

    console.log('Navigating mobile to http://localhost:5178/ ...');
    await mobilePage.goto('http://localhost:5178/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    await waitAndDecode(mobilePage, 'Finora Mobile');

    const mobilePath = path.join(OUTPUT_DIR, 'finora-mobile.jpg');
    await mobilePage.screenshot({ path: mobilePath, type: 'jpeg', quality: 95 });
    console.log(`Saved: ${mobilePath} (${fs.statSync(mobilePath).size} bytes)`);

    await mobilePage.close();

    console.log('\n===============================================================');
    console.log('ALL 5 FINORA VIEWS CAPTURED SUCCESSFULLY FROM LOCALHOST:5178!');
    console.log('===============================================================');
  } catch (err) {
    console.error('Error during Finora capture:', err);
  } finally {
    await browser.close();
  }
}

run();

