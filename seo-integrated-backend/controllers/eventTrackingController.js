// controllers/eventTrackingController.js
const gtmService = require('../services/gtmService');

// ENV (These are used in gtmService, keep here for reference if needed for other routes)
// const ACCOUNT_ID = process.env.GTM_ACCOUNT_ID;
// const CONTAINER_ID = process.env.GTM_CONTAINER_ID;
// const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID;

// Serve only the <script> block (for <head>)
exports.getGtmHeadScript = (req, res) => {
  const { GTM_CONTAINER_ID } = process.env;
  if (!GTM_CONTAINER_ID) return res.status(500).send('Missing GTM_CONTAINER_ID');

  const script = `
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');
</script>
  `.trim();

  res.setHeader('Content-Type', 'text/javascript');
  res.send(script);
};

// Serve only the <noscript> block (for <body>)
exports.getGtmNoScript = (req, res) => {
  const { GTM_CONTAINER_ID } = process.env;
  if (!GTM_CONTAINER_ID) return res.status(500).send('Missing GTM_CONTAINER_ID');

  const noscript = `
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
  `.trim();

  res.setHeader('Content-Type', 'text/html');
  res.send(noscript);
};


// Get all event tracking configs directly from GTM
exports.getAllEvents = async (req, res) => {
  try {
    const events = await gtmService.getEventsFromGTM();
    res.json(events);
  } catch (err) {
    console.error('Error fetching all events from GTM:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new event tracking config in GTM
exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    // Validate required fields for GTM creation based on your desired schema
    if (!eventData.name || !eventData.triggerType || !eventData.selector || !eventData.eventName) {
      return res.status(400).json({ error: 'Missing required event fields: name, triggerType, selector, or eventName.' });
    }

    const { tagId, triggerId } = await gtmService.createTagAndTrigger(eventData);

    // Return the created event with GTM IDs
    res.status(201).json({
      ...eventData, // Return the data sent by the client
      gtmTagId: tagId,
      gtmTriggerId: triggerId,
    });
  } catch (err) {
    console.error('Error creating event in GTM:', err);
    res.status(400).json({ error: err.message });
  }
};

// Update an event config in GTM
exports.updateEvent = async (req, res) => {
  try {
    const eventData = req.body; // Expect GTM IDs and updated fields in body

    // Ensure GTM IDs are provided for update
    if (!eventData.gtmTagId || !eventData.gtmTriggerId) {
      return res.status(400).json({ error: 'Missing gtmTagId or gtmTriggerId in request body for update.' });
    }

    // Pass the entire eventData object, gtmService will use relevant fields
    await gtmService.updateTagAndTrigger(eventData);

    res.json({ message: 'Event updated successfully in GTM', updatedEvent: eventData });
  } catch (err) {
    console.error('Error updating event in GTM:', err);
    res.status(400).json({ error: err.message });
  }
};

// Delete an event config from GTM
exports.deleteEvent = async (req, res) => {
  try {
    const { gtmTagId, gtmTriggerId } = req.body; // Expect GTM IDs in body

    // Ensure GTM IDs are provided for deletion
    if (!gtmTagId || !gtmTriggerId) {
      return res.status(400).json({ error: 'Missing gtmTagId or gtmTriggerId in request body for deletion.' });
    }

    // Pass an object containing the IDs for deletion
    await gtmService.deleteTagAndTrigger({ gtmTagId, gtmTriggerId });

    res.json({ message: 'Event deleted successfully from GTM' });
  } catch (err) {
    console.error('Error deleting event from GTM:', err);
    res.status(500).json({ error: err.message });
  }
};