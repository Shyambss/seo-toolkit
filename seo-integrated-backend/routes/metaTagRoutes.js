const express = require('express');
const {
  generateKeywordsController,
  saveMetaTagsController,
  getAllMetaTagsController,
  deleteMetaTagController,
  updateMetaTagController,
  getMetaTagByPageController,
} = require('../controllers/metaTagController');

const router = express.Router();

// POST /generate-keywords - Generate SEO-friendly keywords
router.post('/generate-keywords', generateKeywordsController);

// POST /meta - Save meta tag data
router.post('/', saveMetaTagsController);

// GET /meta - Get all saved meta tags
router.get('/', getAllMetaTagsController);

// PUT /meta/:id - Update a specific meta tag by ID
router.put('/:id', updateMetaTagController);

// DELETE /meta/:id - Delete a specific meta tag by ID
router.delete('/:id', deleteMetaTagController);

// GET /meta/page?url=/about
router.get('/page', getMetaTagByPageController);

module.exports = router;
