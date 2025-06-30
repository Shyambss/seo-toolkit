const puppeteer = require("puppeteer");
const { URL } = require("url");

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    u.hash = ""; // Remove fragments

    // Optional: To ignore query parameters, uncomment the next line
    // u.search = "";

    // Remove trailing slash if it's not the root path
    if (u.pathname !== "/" && u.pathname.endsWith("/")) {
      u.pathname = u.pathname.slice(0, -1);
    }

    // Lowercase hostname and pathname for consistency
    u.hostname = u.hostname.toLowerCase();
    u.pathname = u.pathname.toLowerCase();

    return u.toString();
  } catch (err) {
    return url; // fallback if URL parsing fails
  }
}

async function crawlWebsite(baseUrl, maxDepth = 2) {
  const visited = new Set();
  const queue = [{ url: normalizeUrl(baseUrl), depth: 0 }];
  const results = [];

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on("request", (req) => {
    const resourceType = req.resourceType();
    if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  while (queue.length > 0) {
    const { url, depth } = queue.shift();

    const normalizedUrl = normalizeUrl(url);

    if (
      visited.has(normalizedUrl) ||
      depth > maxDepth ||
      !normalizedUrl.startsWith(baseUrl)
    )
      continue;
    visited.add(normalizedUrl);

    try {
      console.log(`🌐 Visiting: ${normalizedUrl}`);
      await page.goto(normalizedUrl, { waitUntil: "domcontentloaded", timeout: 15000 });

      results.push(normalizedUrl);

      const links = await page.$$eval("a[href]", (anchors) => {
        const excludedExts = [
          "pdf",
          "jpg",
          "jpeg",
          "png",
          "gif",
          "svg",
          "js",
          "css",
          "zip",
          "exe",
        ];
        const trackingParams = [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_term",
          "utm_content",
        ];

        return anchors
          .map((a) => a.href)
          .filter((href) => {
            if (!href.startsWith("http")) return false;
            if (href.includes("mailto:") || href.includes("tel:") || href.includes("#"))
              return false;

            try {
              const urlObj = new URL(href);

              // Exclude URLs with unwanted file extensions
              const path = urlObj.pathname.toLowerCase();
              const ext = path.split(".").pop();
              if (excludedExts.includes(ext)) return false;

              // Exclude URLs with tracking query params
              for (const param of trackingParams) {
                if (urlObj.searchParams.has(param)) return false;
              }

              // Optional: ignore URLs with any query parameters at all
              // if (urlObj.search) return false;

              return true;
            } catch {
              return false;
            }
          });
      });

      for (const link of links) {
        const normalizedLink = normalizeUrl(link);
        if (!visited.has(normalizedLink) && normalizedLink.startsWith(baseUrl)) {
          queue.push({ url: normalizedLink, depth: depth + 1 });
        }
      }
    } catch (err) {
      console.error(`❌ Error crawling ${normalizedUrl}: ${err.message}`);
    }
  }

  await browser.close();

  console.log(`✅ Finished crawling. Total pages: ${results.length}`);
  return results;
}

module.exports = crawlWebsite;
