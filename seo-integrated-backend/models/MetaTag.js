const mongoose = require('mongoose');

// Define schema for Meta Tags
const metaTagSchema = new mongoose.Schema({
  pageUrl: { type: String, required: true },       // URL of the page (e.g. /about)
  title: { type: String, required: true },         // Title tag
  description: { type: String, required: true },   // Meta description
  keywords: [String]                               // SEO keywords (comma-separated list)
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const MetaTag = mongoose.model('MetaTag', metaTagSchema);
module.exports = MetaTag;
