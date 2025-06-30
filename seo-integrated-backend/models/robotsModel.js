const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  userAgent: { type: String, required: true },
  allow: [String],
  disallow: [String],
  crawlDelay: Number
});

const robotsSchema = new mongoose.Schema({
  rules: [ruleSchema],
  sitemapUrl: { type: String }
});

module.exports = mongoose.model('Robots', robotsSchema);
