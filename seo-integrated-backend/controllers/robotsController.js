const fs = require('fs');
const path = require('path');
const Robots = require('../models/robotsModel');
const generateRobotsTxt = require('../utils/generateRobotsTxt');

// GET robots configuration
exports.getRobots = async (req, res) => {
  try {
    const config = await Robots.findOne();
    if (!config) {
      return res.json({ rules: [], sitemapUrl: '', stats: {} });
    }

    const robotsContent = generateRobotsTxt(config);
    const lines = robotsContent.trim().split('\n');

    const stats = {
      lineCount: lines.length,
      fileSize: Buffer.byteLength(robotsContent, 'utf8'),
      userAgentCount: lines.filter(line => line.toLowerCase().startsWith('user-agent')).length,
      disallowCount: lines.filter(line => line.toLowerCase().startsWith('disallow')).length,
      allowCount: lines.filter(line => line.toLowerCase().startsWith('allow')).length,
      hasSitemap: !!config.sitemapUrl
    };

    res.json({ ...config.toObject(), stats, content: robotsContent });
  } catch (error) {
    console.error('Error fetching robots.txt:', error);
    res.status(500).json({ message: 'Failed to fetch robots.txt configuration' });
  }
};


// UPDATE robots configuration + write to public/robots.txt
exports.updateRobots = async (req, res) => {
  const { rules, sitemapUrl } = req.body;
  let config = await Robots.findOne();

  if (!config) {
    config = new Robots({ rules, sitemapUrl });
  } else {
    config.rules = rules;
    config.sitemapUrl = sitemapUrl;
  }

  await config.save();

  // Generate robots.txt content
  const robotsContent = generateRobotsTxt(config);

  // Write content to public/robots.txt
  const robotsFilePath = path.join(__dirname, '..', 'public', 'robots.txt');
  try {
    fs.writeFileSync(robotsFilePath, robotsContent);
    res.json({ message: 'robots.txt configuration updated and written to public/robots.txt' });
  } catch (error) {
    console.error('Failed to write robots.txt:', error);
    res.status(500).json({ message: 'Error writing robots.txt file' });
  }
};

// SERVE robots.txt content from DB (optional if static file served directly)
exports.serveRobotsTxt = async (req, res) => {
  const config = await Robots.findOne();
  const robotsContent = generateRobotsTxt(config);
  res.type('text/plain').send(robotsContent || '');
};
