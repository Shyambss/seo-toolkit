const TrackedSite = require('../models/TrackedSite');
const { analyzeWebsite } = require('./performanceService');
const { generateSuggestionsWithGemini } = require('./geminiperformance');
const Report = require('../models/Report');

const frequencyMap = {
  hourly: 1 * 60 * 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
};

async function checkAndAnalyzeTrackedSite() {
  const site = await TrackedSite.findOne();
  if (!site) return;

  const now = new Date();
  const lastCheck = site.lastCheckedAt || new Date(0);
  const interval = frequencyMap[site.frequency];

  if (now - lastCheck >= interval) {
    try {
      const { summary, fullLighthouseData } = await analyzeWebsite(site.url, process.env.API_KEY);
      const suggestions = await generateSuggestionsWithGemini(fullLighthouseData);

      const report = await Report.create({
        ...summary,
        suggestions,
        url: site.url,
        date: new Date()
      });

      site.lastCheckedAt = new Date();
      await site.save();
      console.log(`✅ Performance analyzed for ${site.url}`);
    } catch (err) {
      console.error('❌ Failed to analyze tracked site:', err.message);
    }
  }
}

function startTrackingScheduler() {
  // Check every 5 minutes
  setInterval(checkAndAnalyzeTrackedSite, 5 * 60 * 1000);
}

module.exports = { startTrackingScheduler };
