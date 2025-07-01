const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  lastModified: { type: Date, default: Date.now },
  priority: { type: Number, default: 0.5 },
  changeFreq: { type: String, default: "monthly" },
  pageType: { type: String, required: true },
});

// Auto-assign priority and change frequency based on page type
pageSchema.pre("save", function (next) {
  const priorityMap = {
    homepage: 1.0,
    blog: 0.8,
    product: 0.9,
    category: 0.7,
    about: 0.5,
    static: 0.4,
  };
  const changeFreqMap = {
    homepage: "daily",
    blog: "weekly",
    product: "weekly",
    category: "weekly",
    about: "monthly",
    static: "yearly",
  };

  this.priority = priorityMap[this.pageType] || 0.5;
  this.changeFreq = changeFreqMap[this.pageType] || "monthly";
  next();
});

module.exports = mongoose.model("Page", pageSchema);
