const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/', (req, res) => {
  res.send('Puppeteer API Ready. Gunakan /open?url=https://example.com');
});

app.get('/open', async (req, res) => {
  const { url } = req.query;

  if (!url || !url.startsWith('http')) {
    return res.status(400).send('URL tidak valid.');
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Ambil isi HTML dari <body>
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);

    await browser.close();

    // Kirim hasil HTML body sebagai response (content-type text/html)
    res.set('Content-Type', 'text/html');
    res.send(bodyHTML);

  } catch (error) {
    res.status(500).send('Gagal membuka URL: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
