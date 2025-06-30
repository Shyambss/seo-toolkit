function generateRobotsTxt(data) {
    if (!data) return '';
  
    let output = '';
  
    for (const rule of data.rules) {
      output += `User-agent: ${rule.userAgent}\n`;
  
      rule.disallow?.forEach(path => {
        output += `Disallow: ${path}\n`;
      });
  
      rule.allow?.forEach(path => {
        output += `Allow: ${path}\n`;
      });
  
      if (rule.crawlDelay !== undefined) {
        output += `Crawl-delay: ${rule.crawlDelay}\n`;
      }
  
      output += '\n';
    }
  
    if (data.sitemapUrl) {
      output += `Sitemap: ${data.sitemapUrl}\n`;
    }
  
    return output.trim();
  }
  
  module.exports = generateRobotsTxt;
  