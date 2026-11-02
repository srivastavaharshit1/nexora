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

// Helper: Progressive scroll and image decode
async function settleAndDecode(page, label) {
  try {
    await page.evaluate(async () => {
      if (document.fonts) {
        try { await document.fonts.ready; } catch (e) {}
      }
      // Progressive scroll to trigger any lazy loaders or intersection observers
      window.scrollTo({ top: 350, behavior: 'smooth' });
      await new Promise(r => setTimeout(r, 600));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await new Promise(r => setTimeout(r, 600));

      const imgs = Array.from(document.querySelectorAll('img')).filter((img) => {
        const r = img.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
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
    });
    console.log(`[${label}] Page settled, fonts loaded and images verified.`);
  } catch (err) {
    console.log(`[${label}] Decode note:`, err.message);
  }
}

async function run() {
  console.log('Launching browser for PixelShrink captures...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--window-size=1440,900'
    ]
  });

  const baseUrl = 'https://pixelshrink-one.vercel.app';

  try {
    // -------------------------------------------------------------
    // VIEW 1: Homepage & Dropzone Hero (Desktop 1440x900)
    // -------------------------------------------------------------
    console.log('\n--- CAPTURING VIEW 1: PixelShrink Hero Dropzone ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 45000 });
      await settleAndDecode(page, 'Hero');
      await waitMandatory30Seconds('Hero');

      const heroPath = path.join(OUTPUT_DIR, 'pixelshrink-hero.jpg');
      const mainPath = path.join(OUTPUT_DIR, 'pixelshrink.jpg');
      await page.screenshot({ path: heroPath, quality: 92, type: 'jpeg' });
      fs.copyFileSync(heroPath, mainPath);
      console.log(`[Hero] Saved: ${heroPath} (${fs.statSync(heroPath).size} bytes)`);
      console.log(`[Hero] Saved primary thumbnail: ${mainPath}`);
      await page.close();
    }

    // -------------------------------------------------------------
    // VIEW 2: Interactive Compression Studio (Active with Live Metrics)
    // -------------------------------------------------------------
    console.log('\n--- CAPTURING VIEW 2: PixelShrink Active Studio ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 45000 });

      // Upload sample image to activate live compression dashboard
      const fileInput = await page.$('input[type="file"]');
      if (fileInput) {
        const sampleImage = path.resolve('public/projects/finora-hero.jpg');
        await fileInput.uploadFile(sampleImage);
        console.log('[Studio] Uploaded sample image. Waiting for live compression to process...');
      }

      await settleAndDecode(page, 'Studio');
      await waitMandatory30Seconds('Studio');

      const studioPath = path.join(OUTPUT_DIR, 'pixelshrink-studio.jpg');
      await page.screenshot({ path: studioPath, quality: 92, type: 'jpeg' });
      console.log(`[Studio] Saved: ${studioPath} (${fs.statSync(studioPath).size} bytes)`);
      await page.close();
    }

    // -------------------------------------------------------------
    // VIEW 3: Dedicated Image Resizer Tool
    // -------------------------------------------------------------
    console.log('\n--- CAPTURING VIEW 3: PixelShrink Resize Tool ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(`${baseUrl}/resize-image`, { waitUntil: 'networkidle2', timeout: 45000 });
      await settleAndDecode(page, 'Resize');
      await waitMandatory30Seconds('Resize');

      const resizePath = path.join(OUTPUT_DIR, 'pixelshrink-resize.jpg');
      await page.screenshot({ path: resizePath, quality: 92, type: 'jpeg' });
      console.log(`[Resize] Saved: ${resizePath} (${fs.statSync(resizePath).size} bytes)`);
      await page.close();
    }

    // -------------------------------------------------------------
    // VIEW 4: Target Size / Strict KB Optimizer
    // -------------------------------------------------------------
    console.log('\n--- CAPTURING VIEW 4: PixelShrink Target 100KB Mode ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(`${baseUrl}/compress-image-to-100kb`, { waitUntil: 'networkidle2', timeout: 45000 });
      await settleAndDecode(page, 'TargetSize');
      await waitMandatory30Seconds('TargetSize');

      const targetPath = path.join(OUTPUT_DIR, 'pixelshrink-target.jpg');
      await page.screenshot({ path: targetPath, quality: 92, type: 'jpeg' });
      console.log(`[TargetSize] Saved: ${targetPath} (${fs.statSync(targetPath).size} bytes)`);
      await page.close();
    }

    // -------------------------------------------------------------
    // VIEW 5: Mobile Experience (iPhone 14 Pro, 390x844)
    // -------------------------------------------------------------
    console.log('\n--- CAPTURING VIEW 5: PixelShrink Mobile Experience ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
      await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 45000 });
      await settleAndDecode(page, 'Mobile');
      await waitMandatory30Seconds('Mobile');

      const mobilePath = path.join(OUTPUT_DIR, 'pixelshrink-mobile.jpg');
      await page.screenshot({ path: mobilePath, quality: 90, type: 'jpeg' });
      console.log(`[Mobile] Saved: ${mobilePath} (${fs.statSync(mobilePath).size} bytes)`);
      await page.close();
    }

    console.log('\n*** ALL 5 PIXELSHRINK SCREENSHOTS CAPTURED SUCCESSFULLY WITH 30S WAITS! ***');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});

