// services/performanceService.js
const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

async function analyzeWebsite(url) {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${process.env.API_KEY}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
        throw new Error(`PageSpeed API returned status ${response.status}`);
    }

    const data = await response.json();

    if (!data.lighthouseResult) {
        throw new Error("PageSpeed API returned no results.");
    }

    const lighthouse = data.lighthouseResult;

    // Return both the summary (for DB) and the full result (for Gemini AI)
    return {
        summary: {
            url,
            date: new Date(),
            performance_score: lighthouse.categories.performance?.score * 100 || "N/A",
            lcp: lighthouse.audits["largest-contentful-paint"]?.numericValue || "N/A",
            cls: lighthouse.audits["cumulative-layout-shift"]?.numericValue || "N/A",
            ttfb: lighthouse.audits["server-response-time"]?.numericValue || "N/A"
        },
        fullLighthouseData: lighthouse
    };
}

module.exports = { analyzeWebsite };
