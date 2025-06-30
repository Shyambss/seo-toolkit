<<<<<<< HEAD
const RobotsPreview = ({ rules, sitemapUrl }) => {
    const generate = () => {
      let txt = '';
      for (const rule of rules) {
        txt += `User-agent: ${rule.userAgent}\n`;
        (rule.disallow || []).forEach(d => txt += `Disallow: ${d}\n`);
        (rule.allow || []).forEach(a => txt += `Allow: ${a}\n`);
        if (rule.crawlDelay !== undefined) {
          txt += `Crawl-delay: ${rule.crawlDelay}\n`;
        }
        txt += `\n`;
      }
      if (sitemapUrl) {
        txt += `Sitemap: ${sitemapUrl}\n`;
      }
      return txt.trim();
    };
  
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Preview robots.txt</h2>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{generate()}</pre>
      </div>
    );
  };
  
  export default RobotsPreview;
=======
const RobotsPreview = ({ rules, sitemapUrl }) => {
    const generate = () => {
      let txt = '';
      for (const rule of rules) {
        txt += `User-agent: ${rule.userAgent}\n`;
        (rule.disallow || []).forEach(d => txt += `Disallow: ${d}\n`);
        (rule.allow || []).forEach(a => txt += `Allow: ${a}\n`);
        if (rule.crawlDelay !== undefined) {
          txt += `Crawl-delay: ${rule.crawlDelay}\n`;
        }
        txt += `\n`;
      }
      if (sitemapUrl) {
        txt += `Sitemap: ${sitemapUrl}\n`;
      }
      return txt.trim();
    };
  
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Preview robots.txt</h2>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{generate()}</pre>
      </div>
    );
  };
  
  export default RobotsPreview;
>>>>>>> 6f38cf4 (Update frontend with latest changes)
  