const mongoose = require("mongoose");

// Schema for performance report
const reportSchema = new mongoose.Schema({
    url: String,
    date: Date,
    performance_score: mongoose.Schema.Types.Mixed,
    lcp: mongoose.Schema.Types.Mixed,
    cls: mongoose.Schema.Types.Mixed,
    ttfb: mongoose.Schema.Types.Mixed,
    suggestions: String
});

module.exports = mongoose.model("Report", reportSchema);
