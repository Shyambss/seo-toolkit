const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const CREDENTIALS_PATH = path.join(__dirname, '../config/oauth.json');
const TOKEN_PATH = path.join(__dirname, '../config/ga-token.json');

const credentials = require(CREDENTIALS_PATH);
const { client_id, client_secret, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Load tokens if available
if (fs.existsSync(TOKEN_PATH)) {
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  oAuth2Client.setCredentials(token);
}

const SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/tagmanager.edit.containers',
  'https://www.googleapis.com/auth/tagmanager.readonly',
  'https://www.googleapis.com/auth/tagmanager.manage.accounts',
  'https://www.googleapis.com/auth/tagmanager.publish'
];

module.exports = {
  getAuthUrl: () => {
    return oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });
  },

  saveToken: async (code) => {
    const { tokens } = await oAuth2Client.getToken(code);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    oAuth2Client.setCredentials(tokens);
    return tokens;
  },

  getAnalyticsReportingClient: () => {
    return google.analyticsdata({ version: 'v1beta', auth: oAuth2Client });
  },

  getTagManagerClient: () => {
    return google.tagmanager({ version: 'v2', auth: oAuth2Client });
  },

  getOAuthClient: () => oAuth2Client,

  listGtmAccountsAndContainers: async () => {
    const tagmanager = google.tagmanager({ version: 'v2', auth: oAuth2Client });

    const accountsRes = await tagmanager.accounts.list();
    const accounts = accountsRes.data.account || [];

    const accountInfo = [];

    for (const account of accounts) {
      const containersRes = await tagmanager.accounts.containers.list({
        parent: `accounts/${account.accountId}`
      });

      const containers = containersRes.data.container || [];
      accountInfo.push({
        accountId: account.accountId,
        name: account.name,
        containers: containers.map(container => ({
          containerId: container.containerId,
          name: container.name,
          publicId: container.publicId
        }))
      });
    }

    return accountInfo;
  },

  getCustomEventReport: async (propertyId, eventName = null, startDate = '7daysAgo', endDate = 'today') => {
    const analyticsData = google.analyticsdata({ version: 'v1beta', auth: oAuth2Client });

    if (!propertyId) {
      throw new Error('GA4 Property ID is required to fetch reports.');
    }

    const requestPayload = {
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'eventName' },
        { name: 'date' }
      ],
      metrics: [
        { name: 'eventCount' },
        { name: 'totalUsers' }
      ],
      orderBys: [{
        desc: false,
        dimension: { dimensionName: 'date' }
      }],
      limit: 1000
    };

    // Optional filtering by event name
    /*
    if (eventName && eventName !== 'ALL_CUSTOM_EVENTS') {
      requestPayload.dimensionFilter = {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            matchType: 'EXACT',
            value: eventName,
          },
        },
      };
    }
    */

    try {
      const response = await analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: requestPayload,
      });

      const reportData = [];
      if (response.data.rows) {
        response.data.rows.forEach(row => {
          const [eventNameVal, dateVal] = row.dimensionValues.map(dv => dv.value);
          const [eventCount, totalUsers] = row.metricValues.map(mv => mv.value);

          reportData.push({
            eventName: eventNameVal,
            date: dateVal,
            eventCount: parseInt(eventCount),
            totalUsers: parseInt(totalUsers)
          });
        });
      }

      return { report: reportData };

    } catch (error) {
      console.error('Error fetching GA4 custom event report:', error.message);
      if (error.response?.data?.error) {
        console.error('GA API Error:', JSON.stringify(error.response.data.error, null, 2));
      }
      throw new Error(`Failed to fetch GA4 custom event report: ${error.message}`);
    }
  }
};
