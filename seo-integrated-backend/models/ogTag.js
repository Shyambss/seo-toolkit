const mongoose = require("mongoose");

const OgTagSchema = new mongoose.Schema({
    page_url: { type: String, required: true, unique: true },
    og_title: { type: String, required: true },
    og_description: { type: String, required: true },
    og_image: { type: String, required: true },
    og_type: { type: String, default: "website" },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("OgTag", OgTagSchema);
