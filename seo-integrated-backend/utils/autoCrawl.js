// utils/autoCrawl.js
const TrackedSite = require("../models/TrackedSite");
const Page = require("../models/Page");
const generateSitemap = require("./generateSitemap");
const crawlWebsite = require("./crawlWebsite");

const frequencyMap = {
  hourly: 60 * 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
};

function classifyPage(url) {
  if (/\/blog|\/article|\/post/i.test(url)) return "blog";
  if (/\/product/i.test(url)) return "product";
  if (/\/category/i.test(url)) return "category";
  if (/\/about|\/contact|\/privacy|\/terms/i.test(url)) return "about";
  if (/\/$/.test(url)) return "homepage";
  return "static";
}

async function updateSitemapFromTrackedSite(force = false) {
  const site = await TrackedSite.findOne();
  if (!site) return;

  const now = new Date();
  const lastCheck = site.lastCheckedAt || new Date(0);
  const interval = frequencyMap[site.frequency];

  if (!force && now - lastCheck < interval) {
    console.log(`Skipping crawl. Interval not reached.`);
    return;
  }

  try {
    const urls = await crawlWebsite(site.url);

    for (const url of urls) {
      const pageType = classifyPage(url);
      const existing = await Page.findOne({ url });

      if (!existing) {
        const newPage = new Page({ url, pageType });
        await newPage.save();
      } else {
        existing.lastModified = new Date();
        existing.pageType = pageType;
        await existing.save();
      }
    }

    await generateSitemap();

    site.lastCheckedAt = new Date();
    await site.save();
    console.log(`✅ Sitemap updated for ${site.url}`);
  } catch (err) {
    console.error(`❌ Error updating sitemap: ${err.message}`);
  }
}



function startSitemapScheduler() {
  setInterval(updateSitemapFromTrackedSite, 1 * 60 * 1000); // Every 5 mins
}

module.exports = { startSitemapScheduler,updateSitemapFromTrackedSite, };


