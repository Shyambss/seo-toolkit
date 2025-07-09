const express = require("express");
const router = express.Router();
const {
    getOgTags,
    addOgTag,
    updateOgTag,
    deleteOgTag
} = require("../controllers/ogController");

// GET - Fetch OG tag(s)
router.get("/get", getOgTags);

// POST - Add new OG tag
router.post("/add", addOgTag);

// PUT - Update OG tag
router.put("/update", updateOgTag);

// DELETE - Delete OG tag
router.delete("/delete", deleteOgTag);

module.exports = router;
