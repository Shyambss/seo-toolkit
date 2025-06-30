const fetch = require('node-fetch');

async function generateKeywords(title, description, content) {
  const prompt = `Generate a comma-separated list of SEO-friendly keywords based on the following content and don't provide anything else (5-10):
Title: ${title}
Description: ${description}
Content: ${content}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || 'Gemini API error');
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const keywords = text.split(',').map(kw => kw.trim()).filter(Boolean);

    return keywords;
  } catch (error) {
    console.error("Error generating keywords with Gemini:", error.message);
    return [];
  }
}

module.exports = generateKeywords;
