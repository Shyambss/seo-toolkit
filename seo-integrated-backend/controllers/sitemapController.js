const Page = require("../models/Page");
const TrackedSite = require("../models/TrackedSite");
const generateSitemap = require("../utils/generateSitemap");
const { updateSitemapFromTrackedSite } = require("../utils/autoCrawl");

// Add a new page manually
exports.addPage = async (req, res) => {
  try {
    const { url, pageType } = req.body;
    if (!url || !pageType) {
      return res.status(400).json({ message: "URL and pageType are required" });
    }

    const exists = await Page.findOne({ url });
    if (exists) {
      return res.status(400).json({ message: "Page already exists" });
    }

    const newPage = await Page.create({ url, pageType });
    await generateSitemap();

    res.status(201).json({ message: "Page added", page: newPage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all pages
exports.getPages = async (_, res) => {
  try {
    const pages = await Page.find().sort({ lastModified: -1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search pages by URL substring
exports.searchPage = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query required" });
    }

    const results = await Page.find({ url: { $regex: query, $options: "i" } });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a page
exports.updatePage = async (req, res) => {
  try {
    const updated = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Page not found" });
    }

    await generateSitemap();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a page
exports.deletePage = async (req, res) => {
  try {
    const deleted = await Page.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Page not found" });
    }

    await generateSitemap();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Manually regenerate the sitemap
exports.generateSitemap = async (_, res) => {
  try {
    await generateSitemap();
    res.json({ message: "Sitemap generated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crawl the tracked website and update the sitemap
exports.crawlWebsiteAndPopulate = async (_, res) => {
  try {
    await updateSitemapFromTrackedSite(true); // Uses puppeteer smart crawler
    await generateSitemap();
    res.json({ message: "Website crawled and sitemap updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get last crawl time
exports.getCrawlStatus = async (_, res) => {
  const site = await TrackedSite.findOne();
  if (!site) return res.json({ lastCheckedAt: null });

  res.json({ lastCheckedAt: site.lastCheckedAt });
};


// Provide links to sitemap submission tools
exports.sitemapSubmissionGuide = (_, res) => {
  res.json({
    google: "https://search.google.com/search-console/sitemaps",
    bing: "https://www.bing.com/webmasters/sitemaps",
  });
};
