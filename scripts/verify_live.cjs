const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const response = await page.goto('https://nexora-orcin-two.vercel.app', { waitUntil: 'networkidle2' });
  console.log('Page response status:', response.status());

  const audit = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      title: document.title,
      has10Plus: text.includes('10+'),
      hasTurnaround: text.includes('3–4') || text.includes('3-4'),
      hasWhatsApp: !!document.querySelector('a[href*="919506417397"]'),
      hasEmail: !!document.querySelector('a[href*="srivastavaharsh248@gmail.com"]'),
      projectCount: document.querySelectorAll('#work [data-project], #work .group').length,
      sections: ['home', 'services', 'work', 'about', 'pricing', 'contact'].map(id => ({
        id,
        present: !!document.getElementById(id)
      }))
    };
  });

  console.log('Production Audit Result:\n', JSON.stringify(audit, null, 2));
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
