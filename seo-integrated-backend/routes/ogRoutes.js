const express = require("express");
const router = express.Router();
const {
    getOgTags,
    addOgTag,
    updateOgTag,
    deleteOgTag
} = require("../controllers/ogController");

router.get("/get", getOgTags);
router.post("/add", addOgTag);
router.put("/update", updateOgTag);
router.delete("/delete", deleteOgTag);

module.exports = router;
