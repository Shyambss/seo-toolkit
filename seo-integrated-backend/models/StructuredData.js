const mongoose = require('mongoose');

const StructuredDataSchema = new mongoose.Schema({
  type: { type: String, required: true },          // e.g. "blog", "faq"
  url: { type: String, required: true },           // e.g. "/blog/how-to-optimize-seo"
  jsonLD: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

StructuredDataSchema.index({ type: 1, url: 1 }, { unique: true }); // avoid duplicates

module.exports = mongoose.model('StructuredData', StructuredDataSchema);
