const mongoose = require('mongoose')

// Schema for different structured content (blog, faq, testimonial, etc.)
const StructuredDataSchema = new mongoose.Schema({
  type: { type: String, required: true },        // Content type
  url: { type: String, required: true },         // Page URL
  jsonLD: { type: Object, required: true },      // Schema.org JSON-LD data
  createdAt: { type: Date, default: Date.now },
})

// Prevent duplicates for same type and URL
StructuredDataSchema.index({ type: 1, url: 1 }, { unique: true })

module.exports = mongoose.model('StructuredData', StructuredDataSchema)
