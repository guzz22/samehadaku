const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/', (req, res) => {
  res.send('Gunakan endpoint: /open?url=https://example.com');
});

app.get('/open', async (req, res) => {
  const { url } = req.query;

  if (!url || !url.startsWith('http')) {
    return res.status(400).send('Parameter URL tidak valid atau kosong.');
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const bodyHTML = await page.evaluate(() => document.body.innerHTML);

    await browser.close();

    res.setHeader('Content-Type', 'text/html');
    res.send(bodyHTML);
  } catch (error) {
    if (browser) await browser.close();
    res.status(500).send('Gagal membuka halaman: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}`));
