// src/api/gtmApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/gtm/events`, // Base path for GTM event management
  withCredentials: true, // Crucial for sending cookies (if your backend requires authentication/sessions)
});

// Helper for consistent error handling
const handleError = (error, functionName) => {
  const errorDetails = error.response?.data || error.message;
  console.error(`Error in ${functionName}:`, errorDetails);
  throw errorDetails; // Re-throw the structured error for upstream handling
};

// Fetch all GTM events
export const getAllGtmEvents = async () => {
  try {
    const response = await api.get('/'); // GET /api/gtm/events/
    return response.data;
  } catch (error) {
    handleError(error, 'getAllGtmEvents');
  }
};

// Create a new GTM event
export const createGtmEvent = async (eventData) => {
  try {
    const response = await api.post('/', eventData); // POST /api/gtm/events/
    return response.data;
  } catch (error) {
    handleError(error, 'createGtmEvent');
  }
};

// Update an existing GTM event.
// The entire event object including _id, gtmTagId, and gtmTriggerId
// must be sent in the request body, as the backend route is '/' (no ID in URL).
export const updateGtmEvent = async (fullEventData) => { // Accepts the complete event object
  try {
    // Send PUT request to base URL with fullEventData in the body
    const response = await api.put('/', fullEventData); // PUT /api/gtm/events/
    return response.data;
  } catch (error) {
    handleError(error, 'updateGtmEvent');
  }
};

// Delete a GTM event.
// gtmTagId and gtmTriggerId must be sent in the request body for the delete operation.
export const deleteGtmEvent = async (gtmEventIds) => { // Accepts an object like { gtmTagId, gtmTriggerId }
  try {
    // For DELETE requests with a body, pass the body in the 'data' property of the config object
    const response = await api.delete('/', { data: gtmEventIds }); // DELETE /api/gtm/events/
    return response.data;
  } catch (error) {
    handleError(error, 'deleteGtmEvent');
  }
};