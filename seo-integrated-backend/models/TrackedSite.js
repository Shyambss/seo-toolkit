const mongoose = require('mongoose');

const TrackedSiteSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  frequency: {
    type: String,
    enum: ['hourly', 'daily', 'weekly'],
    default: 'daily',
  },
  lastCheckedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('TrackedSite', TrackedSiteSchema);
