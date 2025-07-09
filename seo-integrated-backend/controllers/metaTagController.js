const MetaTag = require('../models/MetaTag');
const generateKeywords = require('../services/geminimeta');

// Generate SEO-friendly keywords using Gemini API
async function generateKeywordsController(req, res) {
  const { title, description, content } = req.body;
  try {
    const keywords = await generateKeywords(title, description, content);
    res.json({ keywords });
  } catch (error) {
    res.status(500).json({ message: 'Error generating keywords' });
  }
}

// Save meta tags to DB
async function saveMetaTagsController(req, res) {
  const { pageUrl, title, description, keywords } = req.body;
  const newMetaTag = new MetaTag({ pageUrl, title, description, keywords });

  try {
    await newMetaTag.save();
    res.status(201).json({ message: 'Meta tags saved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving meta tags' });
  }
}

// Get all meta tags
async function getAllMetaTagsController(req, res) {
  try {
    const metaTags = await MetaTag.find();
    res.status(200).json({ metaTags });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meta tags' });
  }
}

// Delete meta tag by ID
async function deleteMetaTagController(req, res) {
  const { id } = req.params;
  try {
    const deletedMetaTag = await MetaTag.findByIdAndDelete(id);
    if (!deletedMetaTag) {
      return res.status(404).json({ message: 'Meta tag not found' });
    }
    res.status(200).json({ message: 'Meta tag deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting meta tag' });
  }
}

// Update meta tag by ID
async function updateMetaTagController(req, res) {
  const { id } = req.params;
  const { pageUrl, title, description, keywords } = req.body;
  try {
    const updatedMetaTag = await MetaTag.findByIdAndUpdate(
      id,
      { pageUrl, title, description, keywords },
      { new: true }
    );
    if (!updatedMetaTag) {
      return res.status(404).json({ message: 'Meta tag not found' });
    }
    res.status(200).json({ message: 'Meta tag updated successfully', updatedMetaTag });
  } catch (error) {
    res.status(500).json({ message: 'Error updating meta tag' });
  }
}

// Get meta tag by page URL
async function getMetaTagByPageController(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ message: 'Missing page URL query param' });

  try {
    const metaTag = await MetaTag.findOne({ pageUrl: url });
    if (!metaTag) return res.status(404).json({ message: 'No meta tag found for this URL' });
    res.status(200).json({ metaTag });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meta tag by page URL' });
  }
}

module.exports = {
  generateKeywordsController,
  saveMetaTagsController,
  getAllMetaTagsController,
  deleteMetaTagController,
  updateMetaTagController,
  getMetaTagByPageController,
};
