const Report = require("../models/Report");
const TrackedSite = require("../models/TrackedSite");
const { analyzeWebsite } = require("../services/performanceService");
const { generateSuggestionsWithGemini } = require("../services/geminiperformance");

// Manually analyze performance and save report with suggestions
const analyzePerformance = async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "URL parameter is required" });

    try {
        const { summary, fullLighthouseData } = await analyzeWebsite(url, process.env.API_KEY);
        const suggestions = await generateSuggestionsWithGemini(fullLighthouseData);

        const reportWithSuggestions = {
            ...summary,
            suggestions,
        };

        const saved = await Report.create(reportWithSuggestions);
        await TrackedSite.updateOne({ url }, { lastCheckedAt: new Date() });

        res.json(saved);
    } catch (error) {
        res.status(500).json({ error: "Failed to analyze: " + error.message });
    }
};

// Get latest 10 performance reports
const getReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ date: -1 }).limit(10);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve reports" });
    }
};

// Delete a report by ID
const deletereport = async (req, res) => {
    try {
        const deletedReport = await Report.findByIdAndDelete(req.params.id);
        if (!deletedReport) return res.status(404).json({ error: "Report not found" });
        res.json({ message: "Report deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete report" });
    }
};

// Get the currently tracked website info
const getTrackedSite = async (req, res) => {
    try {
        const site = await TrackedSite.findOne();
        res.json(site || {});
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve tracked site info" });
    }
};

// Set or update the tracked website and frequency
const setTrackedSite = async (req, res) => {
    const { url, frequency } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        const existing = await TrackedSite.findOne();
        if (existing) {
            existing.url = url;
            existing.frequency = frequency || 'daily';
            existing.lastCheckedAt = null;
            await existing.save();
        } else {
            await TrackedSite.create({ url, frequency });
        }

        res.json({ message: "Tracked site updated" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save tracked site" });
    }
};

module.exports = {
    analyzePerformance,
    getReports,
    deletereport,
    getTrackedSite,
    setTrackedSite
};
