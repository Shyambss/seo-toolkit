// src/api/analyticsApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const checkGAStatus = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/analytics/status`);
  return res.data;
};

export const fetchGaReport = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/analytics/report`);
  return res.data;
};

export const setGaSettings = async (propertyId) => {
  const res = await axios.post(`${API_BASE_URL}/api/analytics/settings`, { propertyId });
  return res.data;
};

export const revokeGaAuthorization = async () => {
  const res = await axios.post(`${API_BASE_URL}/api/analytics/revoke`);
  return res.data;
};

export const listGtmAccounts = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/analytics/gtm/info`);
  return res.data;
};

// NEW: Function to fetch custom event reports
export const fetchCustomEventReport = async (eventName = null, startDate = '7daysAgo', endDate = 'today') => {
  try {
    const requestBody = {
      eventName,
      startDate,
      endDate,
    };
    const res = await axios.post(`${API_BASE_URL}/api/analytics/custom-events`, requestBody);
    return res.data;
  } catch (error) {
    console.error("Error fetching custom event report:", error.response?.data || error.message);
    throw error;
  }
};