// routes/eventTrackingRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventTrackingController');
const { getGtmHeadScript, getGtmNoScript } = require('../controllers/eventTrackingController'); // Import the GTM script serving functions

// Routes for GTM scripts (these are independent of event management logic)
router.get('/head', getGtmHeadScript);
router.get('/noscript', getGtmNoScript);


// Routes for managing GTM events
router.get('/', getAllEvents);
router.post('/', createEvent);

// For update and delete, we now expect GTM IDs in the request body
// The client will send the full event object, including gtmTagId and gtmTriggerId
router.put('/', updateEvent);
router.delete('/', deleteEvent);

module.exports = router;