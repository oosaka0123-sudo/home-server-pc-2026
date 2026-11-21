const base = 'https://oosaka0123-sudo.github.io/home-server-pc-2026/';
const host = 'oosaka0123-sudo.github.io';
const key = 'fca43398db58ad727cf81fd07b32c6d1';
const keyLocation = `${base}fca43398db58ad727cf81fd07b32c6d1.txt`;
const sitemapUrl = `${base}sitemap-0.xml`;

async function getText(url, attempts = 6) {
  let last;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (res.ok) return await res.text();
      last = new Error(`${url} returned HTTP ${res.status}`);
    } catch (err) {
      last = err;
    }
    if (i < attempts) await new Promise((r) => setTimeout(r, 5000));
  }
  throw last;
}

const hostedKey = (await getText(keyLocation)).trim();
if (hostedKey !== key) {
  throw new Error('IndexNow key file is not yet available at the deployed keyLocation');
}

const sitemap = await getText(sitemapUrl);
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const uniqueUrls = [...new Set(urls)].filter((url) => url.startsWith(base));

if (!uniqueUrls.length) {
  throw new Error('No production URLs found in sitemap-0.xml');
}

const response = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host,
    key,
    keyLocation,
    urlList: uniqueUrls
  })
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`IndexNow submission failed: HTTP ${response.status} ${body}`);
}

console.log(`IndexNow notified successfully: ${uniqueUrls.length} URLs (HTTP ${response.status})`);
