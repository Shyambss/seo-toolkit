// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const {
  authRedirect,
  oauthCallback,
  fetchReport,
  fetchCustomEventReport,
  setGaSettings,
  checkGAStatus,
  revokeAuthorization,
  listGtmAccounts
} = require('../controllers/analyticsController');

router.get('/auth', authRedirect);
router.get('/oauth2callback', oauthCallback);
router.get('/report', fetchReport);
router.post('/custom-events', fetchCustomEventReport); 
router.post('/settings', setGaSettings);
router.get('/status', checkGAStatus);
router.post('/revoke', revokeAuthorization);
router.get('/gtm/info', listGtmAccounts);


module.exports = router;