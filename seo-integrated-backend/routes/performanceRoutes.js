const express = require("express");
const {
    analyzePerformance,
    getReports,
    deletereport,
    getTrackedSite,
    setTrackedSite
} = require("../controllers/performanceController");

const router = express.Router();

router.get("/analyze", analyzePerformance);
router.get("/reports", getReports);
router.delete("/reports/:id", deletereport);

// New endpoints for tracked site config
router.get("/tracked", getTrackedSite);
router.post("/tracked", setTrackedSite);

module.exports = router;
