const express = require('express');
const router = express.Router();
const {
    addStructuredData,
    getStructuredData,
    deleteStructuredData,
    getStructuredDataCount,
    getStructuredDataByUrl 
} = require('../controllers/structuredDataController');

router.post('/:type', addStructuredData);
router.get('/:type', getStructuredData);
router.delete('/:type/:id', deleteStructuredData);
router.get('/:type/count', getStructuredDataCount);
router.get('/:type/single', getStructuredDataByUrl);

module.exports = router;
