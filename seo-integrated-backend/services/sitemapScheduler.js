const TrackedSite = require('../models/TrackedSite');
const Page = require('../models/Page');
const generateSitemap = require('../utils/generateSitemap');
const crawlWebsite = require('../utils/crawlWebsite');

const frequencyMap = {
  hourly: 60 * 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
};

async function updateSitemapFromTrackedSite() {
  const site = await TrackedSite.findOne();
  if (!site) return;

  const now = new Date();
  const lastCheck = site.lastCheckedAt || new Date(0);
  const interval = frequencyMap[site.frequency];

  if (now - lastCheck >= interval) {
    try {
      const urls = await crawlWebsite(site.url);
      for (const url of urls) {
        const existing = await Page.findOne({ url });
        if (!existing) {
          const newPage = new Page({ url, pageType: 'static' });
          await newPage.save();
        } else {
          existing.lastModified = new Date();
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
}

function startSitemapScheduler() {
  setInterval(updateSitemapFromTrackedSite, 5 * 60 * 1000); // every 5 min
}

module.exports = { startSitemapScheduler };
