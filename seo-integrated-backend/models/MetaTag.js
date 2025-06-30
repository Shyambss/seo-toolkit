const mongoose = require('mongoose');

const metaTagSchema = new mongoose.Schema({
  pageUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: [String]
}, {
  timestamps: true // This enables auto-managed `createdAt` and `updatedAt`
});

const MetaTag = mongoose.model('MetaTag', metaTagSchema);

module.exports = MetaTag;
