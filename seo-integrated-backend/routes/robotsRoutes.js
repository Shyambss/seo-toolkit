const express = require('express');
const router = express.Router();
const {
  getRobots,
  updateRobots,
  serveRobotsTxt
} = require('../controllers/robotsController');

router.get('/', getRobots);
router.put('/', updateRobots);
router.get('/robots.txt', serveRobotsTxt);

module.exports = router;
