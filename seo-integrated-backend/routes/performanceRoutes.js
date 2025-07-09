const express = require("express");
const {
    analyzePerformance,
    getReports,
    deletereport,
    getTrackedSite,
    setTrackedSite
} = require("../controllers/performanceController");

const router = express.Router();

// Manual performance check
router.get("/analyze", analyzePerformance);

// Get latest reports
router.get("/reports", getReports);

// Delete a report
router.delete("/reports/:id", deletereport);

// Tracked site configuration
router.get("/tracked", getTrackedSite);
router.post("/tracked", setTrackedSite);

module.exports = router;
