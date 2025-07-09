// controllers/analyticsController.js
const fs = require('fs');
const path = require('path');
const gaClient = require('../services/gaClient'); // Assuming this path is correct
const GaSettings = require('../models/gaSettingsModel');

const TOKEN_PATH = path.join(__dirname, '../config/ga-token.json');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

exports.authRedirect = (req, res) => {
  const url = gaClient.getAuthUrl();
  res.redirect(url);
};

exports.oauthCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.redirect(`${FRONTEND_URL}/analytics?status=error&reason=missing_code`);
  }

  try {
    await gaClient.saveToken(code);
    // After successful token save, update isAuthenticated status in DB
    const settings = await GaSettings.getSingleton(); // Use the singleton method
    settings.isAuthenticated = true;
    await settings.save();

    return res.redirect(`${FRONTEND_URL}/analytics?status=success`);
  } catch (err) {
    console.error('Error during OAuth callback:', err);
    return res.redirect(`${FRONTEND_URL}/analytics?status=error&reason=auth_failed`);
  }
};

exports.fetchReport = async (req, res) => {
  try {
    // Fetch propertyId from DB settings instead of env var for consistency
    const settings = await GaSettings.getSingleton();
    if (!settings || !settings.propertyId) {
      return res.status(400).send('GA4 Property ID not configured in settings.');
    }

    const analytics = gaClient.getAnalyticsReportingClient();

    // Use the propertyId from the settings model
    const response = await analytics.properties.runReport({
      property: `properties/${settings.propertyId}`, // Use settings.propertyId
      requestBody: {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'newUsers' },
          { name: 'averageSessionDuration' },
          { name: 'engagementRate' },
          { name: 'sessions' }
        ]
      }
    });

    const rows = response.data.rows || [];

    const formattedReport = rows.map(row => {
      const [pagePath] = row.dimensionValues.map(d => d.value);
      const [
        screenPageViews,
        newUsers,
        avgSessionDuration,
        engagementRate,
        sessions
      ] = row.metricValues.map(m => m.value);

      return {
        pagePath,
        screenPageViews: Number(screenPageViews),
        newUsers: Number(newUsers),
        averageSessionDuration: (Number(avgSessionDuration) / 60).toFixed(2), // in minutes
        engagementRate: `${(Number(engagementRate) * 100).toFixed(1)}%`,
        sessions: Number(sessions)
      };
    });

    res.json({ report: formattedReport });
  } catch (err) {
    console.error('Error fetching GA data (general report):', err.response?.data || err.message);
    res.status(500).send('Failed to fetch analytics data');
  }
};

// ✅ NEW: Controller function to fetch custom event reports
exports.fetchCustomEventReport = async (req, res) => {
    try {
        const settings = await GaSettings.getSingleton();
        if (!settings || !settings.propertyId) {
            return res.status(400).json({ message: 'GA4 Property ID not configured in settings.' });
        }

        const { eventName, startDate, endDate } = req.query; // Get filters from query params

        const report = await gaClient.getCustomEventReport(
            settings.propertyId,
            eventName,
            startDate,
            endDate
        );
        res.json({ report });
    } catch (error) {
        console.error('Error fetching custom event report:', error.message);
        res.status(500).json({ message: 'Failed to fetch custom event report', error: error.message });
    }
};


exports.setGaSettings = async (req, res) => {
  const { propertyId } = req.body;
  if (!propertyId) return res.status(400).json({ message: 'Missing propertyId' });

  // Use the singleton method to ensure only one record
  let settings = await GaSettings.getSingleton();
  settings.propertyId = propertyId;
  settings.isAuthenticated = fs.existsSync(TOKEN_PATH); // Check if token exists to determine auth status

  await settings.save();
  res.json({ message: 'GA settings updated', settings });
};

exports.checkGAStatus = async (req, res) => {
  const tokenExists = fs.existsSync(TOKEN_PATH);
  const settings = await GaSettings.getSingleton();
  const isAuthenticatedInDb = settings ? settings.isAuthenticated : false;

  // It's good to reconcile DB status with actual token existence
  if (settings && isAuthenticatedInDb !== tokenExists) { // Only update if settings exist and status differs
    settings.isAuthenticated = tokenExists;
    await settings.save();
  }

  res.json({ connected: tokenExists, isAuthenticatedInDb: settings.isAuthenticated, propertyId: settings.propertyId });
};

exports.revokeAuthorization = async (req, res) => {
  try {
    // Delete stored token file
    if (fs.existsSync(TOKEN_PATH)) {
      fs.unlinkSync(TOKEN_PATH);
    }

    // Update DB settings
    const settings = await GaSettings.getSingleton();
    if (settings) {
      settings.isAuthenticated = false;
      await settings.save();
    }

    res.json({ message: 'Authorization revoked' });
  } catch (err) {
    console.error('Failed to revoke authorization:', err);
    res.status(500).json({ message: 'Failed to revoke authorization' });
  }
};


exports.listGtmAccounts = async (req, res) => {
  try {
    const result = await gaClient.listGtmAccountsAndContainers();
    res.json(result);
  } catch (err) {
    console.error('Error fetching GTM accounts:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to list GTM accounts' });
  }
};