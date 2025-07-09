// services/gtmService.js
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Paths
const CREDENTIALS_PATH = path.join(__dirname, '../config/oauth.json');
const TOKEN_PATH = path.join(__dirname, '../config/ga-token.json');

// Load OAuth credentials
let credentials;
try {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(`❌ Credentials file not found at ${CREDENTIALS_PATH}. Please ensure it exists.`);
  }
  credentials = require(CREDENTIALS_PATH);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const { client_id, client_secret, redirect_uris } = credentials.web;

// Setup OAuth2 client
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Load token if it exists
if (fs.existsSync(TOKEN_PATH)) {
  try {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
    console.log('✅ GTM API client initialized with existing token.');
  } catch (err) {
    console.error(`❌ Error parsing token file at ${TOKEN_PATH}:`, err.message);
  }
}

const tagmanager = google.tagmanager({ version: 'v2', auth: oAuth2Client });

const ACCOUNT_ID = process.env.GTM_ACCOUNT_ID;
const CONTAINER_ID = process.env.GTM_CONTAINER_ID;
const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID;

if (!ACCOUNT_ID || !CONTAINER_ID || !GA4_MEASUREMENT_ID) {
  console.error('❌ Missing environment variables. Please ensure GTM_ACCOUNT_ID, GTM_CONTAINER_ID, and GA4_MEASUREMENT_ID are set in your .env file.');
  process.exit(1);
}

let cachedWorkspace = null;
const getWorkspace = async () => {
  if (cachedWorkspace) return cachedWorkspace;
  try {
    const res = await tagmanager.accounts.containers.workspaces.list({
      parent: `accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}`
    });
    const workspaces = res.data.workspace || [];
    if (workspaces.length === 0) throw new Error('No GTM workspace found.');
    cachedWorkspace = workspaces.find(w => w.name?.includes('Default Workspace')) || workspaces[0];
    return cachedWorkspace;
  } catch (error) {
    console.error('Error getting GTM workspace:', error.message);
    throw new Error(`Failed to retrieve GTM workspace: ${error.message}`);
  }
};

exports.getAllTags = async () => {
  const workspace = await getWorkspace();
  try {
    const res = await tagmanager.accounts.containers.workspaces.tags.list({ parent: workspace.path });
    return res.data.tag || [];
  } catch (error) {
    console.error('Error fetching GTM tags:', error.message);
    throw new Error(`Failed to fetch GTM tags: ${error.message}`);
  }
};

exports.getAllTriggers = async () => {
  const workspace = await getWorkspace();
  try {
    const res = await tagmanager.accounts.containers.workspaces.triggers.list({ parent: workspace.path });
    return res.data.trigger || [];
  } catch (error) {
    console.error('Error fetching GTM triggers:', error.message);
    throw new Error(`Failed to fetch GTM triggers: ${error.message}`);
  }
};

exports.mapGtmEntitiesToEvent = (gtmTag, gtmTrigger) => {
  const event = {
    _id: gtmTag.tagId,
    gtmTagId: gtmTag.tagId,
    gtmTriggerId: gtmTrigger.triggerId,
    status: 'enabled',
  };

  event.name = gtmTag.name?.startsWith('Tag - ') ? gtmTag.name.substring(6) : gtmTag.name || `Unnamed Tag - ${gtmTag.tagId}`;

  if (gtmTag.type === 'gaawe' && gtmTag.parameter) {
    gtmTag.parameter.forEach(param => {
      if (param.key === 'eventName') event.eventName = param.value;
      if (param.key === 'eventParameters' && Array.isArray(param.parameter)) {
        param.parameter.forEach(sub => {
          if (sub.key === 'category') event.category = sub.value;
          if (sub.key === 'label') event.label = sub.value;
        });
      }
    });
  }

  if (gtmTrigger.type.toLowerCase() === 'click') {
    event.triggerType = 'click';
    const filter = gtmTrigger.filter?.find(f => f.parameter?.some(p => p.key === 'arg0' && p.value === '{{Click Element}}'));
    const selectorParam = filter?.parameter?.find(p => p.key === 'arg1');
    event.selector = selectorParam?.value || '';
  } else if (gtmTrigger.type.toLowerCase() === 'elementvisibility') {
    event.triggerType = 'visibility';
    event.selector = gtmTrigger.elementSelector || '';
  }

  return event;
};

exports.getEventsFromGTM = async () => {
  const tags = await exports.getAllTags();
  const triggers = await exports.getAllTriggers();
  const triggerMap = new Map(triggers.map(t => [t.triggerId, t]));

  return tags
    .filter(t => t.name?.startsWith('Tag - ') && t.type === 'gaawe' && t.firingTriggerId?.length)
    .map(tag => {
      const trigger = triggerMap.get(tag.firingTriggerId[0]);
      if (trigger && (trigger.name?.startsWith('Trigger - ') || trigger.triggerId === "37")) {
        return exports.mapGtmEntitiesToEvent(tag, trigger);
      }
    })
    .filter(Boolean);
};

exports.createTagAndTrigger = async (eventData) => {
  const workspace = await getWorkspace();
  const parent = workspace.path;
  try {
    let triggerBody = {
      name: `Trigger - ${eventData.name}`,
      type: eventData.triggerType === 'click' ? 'CLICK' : 'ELEMENT_VISIBILITY',
      ...(eventData.triggerType === 'click'
        ? {
            filter: [{
              type: 'cssSelector',
              parameter: [
                { type: 'template', key: 'arg0', value: '{{Click Element}}' },
                { type: 'template', key: 'arg1', value: eventData.selector }
              ]
            }]
          }
        : {
            elementSelector: eventData.selector,
            visibilityPercentageMin: 1,
            fireEveryTime: false
          })
    };

    const triggerRes = await tagmanager.accounts.containers.workspaces.triggers.create({ parent, requestBody: triggerBody });
    const triggerId = triggerRes.data.triggerId;

    const tagRes = await tagmanager.accounts.containers.workspaces.tags.create({
      parent,
      requestBody: {
        name: `Tag - ${eventData.name}`,
        type: 'gaawe',
        parameter: [
          { key: 'measurementIdOverride', type: 'template', value: GA4_MEASUREMENT_ID },
          { key: 'eventName', type: 'template', value: eventData.eventName },
          {
            type: 'map',
            key: 'eventParameters',
            parameter: [
              { key: 'category', type: 'template', value: eventData.category || 'Custom Event' },
              { key: 'label', type: 'template', value: eventData.label || '' }
            ]
          }
        ],
        firingTriggerId: [triggerId],
      }
    });

    const tagId = tagRes.data.tagId;

    return { tagId, triggerId };
  } catch (error) {
    console.error('Error creating GTM Tag and Trigger:', error.message);
    throw new Error(error.message.includes('duplicate') ? 'Duplicate tag or trigger name.' : error.message);
  }
};

exports.updateTagAndTrigger = async (eventData) => {
  const workspace = await getWorkspace();
  const parent = workspace.path;

  try {
    let triggerBody = {
      name: `Trigger - ${eventData.name}`,
      type: eventData.triggerType === 'click' ? 'CLICK' : 'ELEMENT_VISIBILITY',
      ...(eventData.triggerType === 'click'
        ? {
            filter: [{
              type: 'cssSelector',
              parameter: [
                { type: 'template', key: 'arg0', value: '{{Click Element}}' },
                { type: 'template', key: 'arg1', value: eventData.selector }
              ]
            }]
          }
        : {
            elementSelector: eventData.selector,
            visibilityPercentageMin: 1,
            fireEveryTime: false
          })
    };

    await tagmanager.accounts.containers.workspaces.triggers.update({
      path: `${parent}/triggers/${eventData.gtmTriggerId}`,
      requestBody: triggerBody
    });

    await tagmanager.accounts.containers.workspaces.tags.update({
      path: `${parent}/tags/${eventData.gtmTagId}`,
      requestBody: {
        name: `Tag - ${eventData.name}`,
        type: 'gaawe',
        parameter: [
          { key: 'measurementIdOverride', type: 'template', value: GA4_MEASUREMENT_ID },
          { key: 'eventName', type: 'template', value: eventData.eventName },
          {
            type: 'map',
            key: 'eventParameters',
            parameter: [
              { key: 'category', type: 'template', value: eventData.category || 'Custom Event' },
              { key: 'label', type: 'template', value: eventData.label || '' }
            ]
          }
        ],
        firingTriggerId: [eventData.gtmTriggerId],
      }
    });

  } catch (error) {
    console.error('Error updating GTM Tag and Trigger:', error.message);
    throw new Error(`Failed to update: ${error.message}`);
  }
};

exports.deleteTagAndTrigger = async (eventData) => {
  const workspace = await getWorkspace();
  const parent = workspace.path;
  try {
    await tagmanager.accounts.containers.workspaces.tags.delete({ path: `${parent}/tags/${eventData.gtmTagId}` });
    await tagmanager.accounts.containers.workspaces.triggers.delete({ path: `${parent}/triggers/${eventData.gtmTriggerId}` });
  } catch (error) {
    if (error.code !== 404) {
      console.error('Error deleting GTM Tag/Trigger:', error.message);
      throw new Error(error.message);
    }
  }
};

