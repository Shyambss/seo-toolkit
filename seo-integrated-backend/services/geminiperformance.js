// utils/gemini.js
const fetch = require("node-fetch");

async function generateSuggestionsWithGemini(lighthouseData) {
    // Filter non-perfect audits to focus on what's improvable
    const failedAudits = Object.entries(lighthouseData.audits)
        .filter(([key, val]) => val?.score !== 1 && val?.scoreDisplayMode !== "notApplicable")
        .map(([key, val]) => `- ${val.title}: ${val.description || "Needs improvement."}`);

    // Generate a clean prompt with context
    const prompt = `
You are a web performance expert. Based on the following Lighthouse report, generate actionable performance improvement suggestions.

Here are the audit items that are not perfect:
${failedAudits.slice(0, 15).join("\n")}

Use numbered points plain language.

Give me a short, Limit each point to one sentence. Prioritize only the top 3–5 fixes.

just give the points and nothing more than that. 

don't use *
    `;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }]
        })
    });

    const data = await response.json();

    if (!data || !data.candidates || !data.candidates.length) {
        throw new Error("Gemini API returned no suggestions.");
    }

    return data.candidates[0].content.parts[0].text;
}

module.exports = { generateSuggestionsWithGemini };
