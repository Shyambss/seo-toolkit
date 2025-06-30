const fs = require("fs");
const path = require("path");
const Page = require("../models/Page");

const generateSitemap = async () => {
  const pages = await Page.find();

  const sitemap = pages.map(page => `
    <url>
      <loc>${page.url}</loc>
      <lastmod>${page.lastModified.toISOString()}</lastmod>
      <priority>${page.priority}</priority>
      <changefreq>${page.changeFreq}</changefreq>
    </url>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap}</urlset>`;

  fs.writeFileSync(path.join(__dirname, "../public/sitemap.xml"), xml);
};

module.exports = generateSitemap;
