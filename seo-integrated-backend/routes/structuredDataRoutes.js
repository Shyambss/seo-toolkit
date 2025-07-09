const express = require('express')
const router = express.Router()

const {
  addStructuredData,
  getStructuredData,
  deleteStructuredData,
  getStructuredDataCount,
  getStructuredDataByUrl
} = require('../controllers/structuredDataController')

// Add structured data
router.post('/:type', addStructuredData)

// Get all structured data for a type
router.get('/:type', getStructuredData)

// Delete specific structured data by ID
router.delete('/:type/:id', deleteStructuredData)

// Get count by type
router.get('/:type/count', getStructuredDataCount)

// Get data by URL (per type)
router.get('/:type/single', getStructuredDataByUrl)

module.exports = router
