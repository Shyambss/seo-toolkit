const express = require("express");
const path = require("path");
const {
  addPage,
  getPages,
  searchPage,
  updatePage,
  deletePage,
  generateSitemap,
  sitemapSubmissionGuide,
  crawlWebsiteAndPopulate,
  getCrawlStatus
} = require("../controllers/sitemapController");

const router = express.Router();

// Page CRUD
router.post("/add-page", addPage);
router.get("/get-pages", getPages);
router.get("/search", searchPage);
router.put("/update-page/:id", updatePage);
router.delete("/delete-page/:id", deletePage);

// Sitemap generation and crawling
router.get("/generate-sitemap", generateSitemap);
router.get("/crawl-site", crawlWebsiteAndPopulate);
router.get("/submission-guide", sitemapSubmissionGuide);
router.get('/status', getCrawlStatus);


// Serve sitemap file
router.get("/sitemap.xml", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/sitemap.xml"));
});

module.exports = router;
