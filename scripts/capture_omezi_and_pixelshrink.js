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

// Helper: Settle fonts, decode images
async function settleAndDecode(page, label) {
  try {
    await page.evaluate(async () => {
      if (document.fonts) {
        try { await document.fonts.ready; } catch (e) {}
      }
      window.scrollTo({ top: 300, behavior: 'smooth' });
      await new Promise((r) => setTimeout(r, 500));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await new Promise((r) => setTimeout(r, 500));

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
    console.log(`[${label}] Fonts and assets settled.`);
  } catch (err) {
    console.log(`[${label}] Decode note:`, err.message);
  }
}

// Enforce clean light mode for PixelShrink
async function enforceLightMode(page) {
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
    localStorage.setItem('color-theme', 'light');
  });
}

async function run() {
  console.log('Launching browser for PixelShrink (Light Mode) and Omezi captures...');
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

  try {
    // =========================================================================
    // PART 1: PIXELSHRINK IN LIGHT MODE (5 VIEWS)
    // =========================================================================
    const psBaseUrl = 'https://pixelshrink-one.vercel.app';

    // PS View 1: Hero Dropzone (Light Mode)
    console.log('\n--- CAPTURING PS VIEW 1: PixelShrink Hero (Light Mode) ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(psBaseUrl, { waitUntil: 'networkidle2', timeout: 45000 });
      await enforceLightMode(page);
      await settleAndDecode(page, 'PS-Hero-Light');
      await waitMandatory30Seconds('PS-Hero-Light');

      const heroPath = path.join(OUTPUT_DIR, 'pixelshrink-hero.jpg');
      const mainPath = path.join(OUTPUT_DIR, 'pixelshrink.jpg');
      await page.screenshot({ path: heroPath, quality: 92, type: 'jpeg' });
      fs.copyFileSync(heroPath, mainPath);
      console.log(`[PS-Hero-Light] Saved: ${heroPath} (${fs.statSync(heroPath).size} bytes)`);
      await page.close();
    }

    // PS View 2: Active Studio with Compression Metrics (Light Mode)
    console.log('\n--- CAPTURING PS VIEW 2: PixelShrink Active Studio (Light Mode) ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(psBaseUrl, { waitUntil: 'networkidle2', timeout: 45000 });
      await enforceLightMode(page);

      const fileInput = await page.$('input[type="file"]');
      if (fileInput) {
        const sampleImage = path.resolve('public/projects/finora-hero.jpg');
        await fileInput.uploadFile(sampleImage);
        console.log('[PS-Studio-Light] Uploaded sample image for live compression...');
      }

      await settleAndDecode(page, 'PS-Studio-Light');
      await waitMandatory30Seconds('PS-Studio-Light');

      const studioPath = path.join(OUTPUT_DIR, 'pixelshrink-studio.jpg');
      await page.screenshot({ path: studioPath, quality: 92, type: 'jpeg' });
      console.log(`[PS-Studio-Light] Saved: ${studioPath} (${fs.statSync(studioPath).size} bytes)`);
      await page.close();
    }

    // PS View 3: Image Resizer (Light Mode)
    console.log('\n--- CAPTURING PS VIEW 3: PixelShrink Resize (Light Mode) ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(`${psBaseUrl}/resize-image`, { waitUntil: 'networkidle2', timeout: 45000 });
      await enforceLightMode(page);
      await settleAndDecode(page, 'PS-Resize-Light');
      await waitMandatory30Seconds('PS-Resize-Light');

      const resizePath = path.join(OUTPUT_DIR, 'pixelshrink-resize.jpg');
      await page.screenshot({ path: resizePath, quality: 92, type: 'jpeg' });
      console.log(`[PS-Resize-Light] Saved: ${resizePath} (${fs.statSync(resizePath).size} bytes)`);
      await page.close();
    }

    // PS View 4: Target KB Mode (Light Mode)
    console.log('\n--- CAPTURING PS VIEW 4: PixelShrink Target 100KB (Light Mode) ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(`${psBaseUrl}/compress-image-to-100kb`, { waitUntil: 'networkidle2', timeout: 45000 });
      await enforceLightMode(page);
      await settleAndDecode(page, 'PS-Target-Light');
      await waitMandatory30Seconds('PS-Target-Light');

      const targetPath = path.join(OUTPUT_DIR, 'pixelshrink-target.jpg');
      await page.screenshot({ path: targetPath, quality: 92, type: 'jpeg' });
      console.log(`[PS-Target-Light] Saved: ${targetPath} (${fs.statSync(targetPath).size} bytes)`);
      await page.close();
    }

    // PS View 5: Mobile Experience (Light Mode)
    console.log('\n--- CAPTURING PS VIEW 5: PixelShrink Mobile (Light Mode) ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
      await page.goto(psBaseUrl, { waitUntil: 'networkidle2', timeout: 45000 });
      await enforceLightMode(page);
      await settleAndDecode(page, 'PS-Mobile-Light');
      await waitMandatory30Seconds('PS-Mobile-Light');

      const mobilePath = path.join(OUTPUT_DIR, 'pixelshrink-mobile.jpg');
      await page.screenshot({ path: mobilePath, quality: 90, type: 'jpeg' });
      console.log(`[PS-Mobile-Light] Saved: ${mobilePath} (${fs.statSync(mobilePath).size} bytes)`);
      await page.close();
    }

    // =========================================================================
    // PART 2: OMEZI FROM LOCALHOST:5178 (5 VIEWS)
    // =========================================================================
    const omeziBaseUrl = 'http://localhost:5178';

    // Omezi View 1: Main Lobby & Hero (Desktop 1440x900)
    console.log('\n--- CAPTURING OMEZI VIEW 1: Lobby & Hero ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(omeziBaseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await settleAndDecode(page, 'Omezi-Hero');
      await waitMandatory30Seconds('Omezi-Hero');

      const heroPath = path.join(OUTPUT_DIR, 'omezi-hero.jpg');
      const mainPath = path.join(OUTPUT_DIR, 'omezi.jpg');
      await page.screenshot({ path: heroPath, quality: 92, type: 'jpeg' });
      fs.copyFileSync(heroPath, mainPath);
      console.log(`[Omezi-Hero] Saved: ${heroPath} (${fs.statSync(heroPath).size} bytes)`);
      await page.close();
    }

    // Omezi View 2: Live Chat & Pairing Interface (/chat)
    console.log('\n--- CAPTURING OMEZI VIEW 2: Chat Workspace ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(`${omeziBaseUrl}/chat`, { waitUntil: 'networkidle2', timeout: 30000 });
      await settleAndDecode(page, 'Omezi-Chat');
      await waitMandatory30Seconds('Omezi-Chat');

      const chatPath = path.join(OUTPUT_DIR, 'omezi-chat.jpg');
      await page.screenshot({ path: chatPath, quality: 92, type: 'jpeg' });
      console.log(`[Omezi-Chat] Saved: ${chatPath} (${fs.statSync(chatPath).size} bytes)`);
      await page.close();
    }

    // Omezi View 3: Interests Matching & Feature Pillars
    console.log('\n--- CAPTURING OMEZI VIEW 3: Interests & Features ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(omeziBaseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.evaluate(() => {
        window.scrollTo({ top: 480, behavior: 'instant' });
      });
      await settleAndDecode(page, 'Omezi-Interests');
      await waitMandatory30Seconds('Omezi-Interests');

      const featPath = path.join(OUTPUT_DIR, 'omezi-interests.jpg');
      await page.screenshot({ path: featPath, quality: 92, type: 'jpeg' });
      console.log(`[Omezi-Interests] Saved: ${featPath} (${fs.statSync(featPath).size} bytes)`);
      await page.close();
    }

    // Omezi View 4: Community Safety & Moderation Guide (/safety)
    console.log('\n--- CAPTURING OMEZI VIEW 4: Safety Guide ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(`${omeziBaseUrl}/safety`, { waitUntil: 'networkidle2', timeout: 30000 });
      await settleAndDecode(page, 'Omezi-Safety');
      await waitMandatory30Seconds('Omezi-Safety');

      const safetyPath = path.join(OUTPUT_DIR, 'omezi-safety.jpg');
      await page.screenshot({ path: safetyPath, quality: 92, type: 'jpeg' });
      console.log(`[Omezi-Safety] Saved: ${safetyPath} (${fs.statSync(safetyPath).size} bytes)`);
      await page.close();
    }

    // Omezi View 5: Mobile Random Chat (iPhone 14 Pro, 390x844)
    console.log('\n--- CAPTURING OMEZI VIEW 5: Mobile Experience ---');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
      await page.goto(omeziBaseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await settleAndDecode(page, 'Omezi-Mobile');
      await waitMandatory30Seconds('Omezi-Mobile');

      const mobilePath = path.join(OUTPUT_DIR, 'omezi-mobile.jpg');
      await page.screenshot({ path: mobilePath, quality: 90, type: 'jpeg' });
      console.log(`[Omezi-Mobile] Saved: ${mobilePath} (${fs.statSync(mobilePath).size} bytes)`);
      await page.close();
    }

    console.log('\n*** ALL 10 SCREENSHOTS CAPTURED CLEANLY WITH MANDATORY 30S WAITS! ***');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});

