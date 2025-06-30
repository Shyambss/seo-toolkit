const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("url");
const Page = require("../models/Page");

function isInternalUrl(baseUrl, targetUrl) {
  try {
    const base = new URL(baseUrl);
    const target = new URL(targetUrl);
    return base.hostname === target.hostname;
  } catch {
    return false;
  }
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.search = ""; // remove query params
    parsed.hash = "";   // remove fragments
    return parsed.toString();
  } catch {
    return url;
  }
}

async function crawlSite(rootUrl, maxPages = 100) {
  const visited = new Set();
  const queue = [rootUrl];

  while (queue.length > 0 && visited.size < maxPages) {
    const currentUrl = queue.shift();
    const normalizedUrl = normalizeUrl(currentUrl);
    if (visited.has(normalizedUrl)) continue;
    visited.add(normalizedUrl);

    if (!isInternalUrl(rootUrl, normalizedUrl)) continue;

    try {
      const res = await axios.get(normalizedUrl);
      const $ = cheerio.load(res.data);

      const exists = await Page.findOne({ url: normalizedUrl });
      if (!exists) {
        await Page.create({ url: normalizedUrl, pageType: "static" });
        console.log(`✅ Saved: ${normalizedUrl}`);
      }

      $("a[href]").each((_, el) => {
        const href = $(el).attr("href");
        if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;

        try {
          const absoluteUrl = new URL(href, normalizedUrl).toString();
          const cleanUrl = normalizeUrl(absoluteUrl);
          if (!visited.has(cleanUrl)) queue.push(cleanUrl);
        } catch {}
      });
    } catch {
      console.log(`❌ Failed: ${normalizedUrl}`);
    }
  }

  console.log(`🧭 Finished. Total crawled: ${visited.size}`);
}

module.exports = crawlSite;
