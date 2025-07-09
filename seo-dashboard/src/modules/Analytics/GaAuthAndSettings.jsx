// src/modules/Analytics/GaAuthAndSettings.jsx
import React, { useState, useEffect } from 'react';
import { setGaSettings, revokeGaAuthorization } from '../../api/analyticsApi';
import { toast } from 'react-toastify'; // Use toast for notifications

const GaAuthAndSettings = ({ gaConnected, gaPropertyId, refreshGaStatus, loading }) => {
  const [inputPropertyId, setInputPropertyId] = useState(gaPropertyId || '');
  const [isSaving, setIsSaving] = useState(false);

  // Update input when gaPropertyId prop changes (e.g., on initial load or refresh)
  useEffect(() => {
    setInputPropertyId(gaPropertyId || '');
  }, [gaPropertyId]);

  // Handle redirects from OAuth callback
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const authStatus = query.get('status');
    const reason = query.get('reason');

    if (authStatus) {
      if (authStatus === 'success') {
        toast.success('Google Analytics authenticated successfully!', { autoClose: 3000 });
        refreshGaStatus(); // Refresh status after successful auth
      } else if (authStatus === 'error') {
        toast.error(`Google Analytics authentication failed: ${reason || 'Unknown error'}.`, { autoClose: 5000 });
      }
      // Clean up URL params after processing
      const url = new URL(window.location.href);
      url.searchParams.delete('status');
      url.searchParams.delete('reason');
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [refreshGaStatus]);

  const handleConnectGA = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/analytics/auth`;
  };

  const handleRevokeAuth = async () => {
    if (!window.confirm('Are you sure you want to revoke Google Analytics authorization? This will disconnect all GA/GTM functionalities.')) {
      return;
    }
    try {
      await revokeGaAuthorization();
      toast.info('Disconnected from Google Analytics.', { autoClose: 3000 });
      refreshGaStatus();
    } catch (err) {
      console.error(err);
      toast.error('Failed to disconnect Google Analytics.', { autoClose: 5000 });
    }
  };

  const handleSetPropertyId = async () => {
    if (!inputPropertyId) {
      toast.warn('Please enter a GA4 Property ID.', { autoClose: 3000 });
      return;
    }
    // Basic validation for numeric ID format
    if (inputPropertyId.startsWith('G-')) {
        toast.error('Please enter the numeric GA4 Property ID (e.g., 123456789), not the G- Measurement ID.', { autoClose: 7000 });
        return;
    }
    if (isNaN(Number(inputPropertyId))) {
        toast.error('Invalid Property ID format. A numeric ID is expected.', { autoClose: 7000 });
        return;
    }

    setIsSaving(true);
    try {
      await setGaSettings(inputPropertyId);
      toast.success('GA4 Property ID saved successfully!', { autoClose: 3000 });
      refreshGaStatus(); // Refresh status to ensure dashboard picks up new ID
    } catch (err) {
      console.error(err);
      toast.error(`Failed to save GA4 Property ID: ${err.response?.data?.message || err.message}`, { autoClose: 7000 });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="mb-6 border-b pb-4">
        <p className={`text-lg font-semibold flex items-center ${gaConnected ? 'text-green-600' : 'text-red-500'}`}>
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24">...</svg> Checking connection...
            </>
          ) : gaConnected ? (
            <>
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Connected to Google Account
            </>
          ) : (
            <>
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2A9 9 0 1118 0a9 9 0 0118 0z" /></svg>
              Not connected to Google Analytics
            </>
          )}
        </p>
        <div className="mt-4 flex gap-3">
          {!gaConnected && (
            <button
              onClick={handleConnectGA}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Connect Google Account
            </button>
          )}
          {gaConnected && (
            <button
              onClick={handleRevokeAuth}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Revoke Authorization
            </button>
          )}
        </div>
      </div>

      <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
        <label htmlFor="gaPropertyIdInput" className="block text-gray-700 text-sm font-bold mb-2">
          GA4 Numeric Property ID:
        </label>
        <input
          type="text"
          id="gaPropertyIdInput"
          value={inputPropertyId}
          onChange={(e) => setInputPropertyId(e.target.value)}
          placeholder="e.g., 123456789"
          className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <p className="text-xs text-gray-500 mt-1">
            Find this in GA4 Admin &gt; Property Settings. It's a number, not "G-XXXXXXXXXX".
        </p>
        <button
          onClick={handleSetPropertyId}
          disabled={isSaving}
          className={`mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSaving ? 'Saving...' : 'Save GA4 Property ID'}
        </button>
        {gaPropertyId && (
          <p className="text-sm text-gray-600 mt-3 flex items-center">
            <span className="font-medium mr-2">Current Property ID:</span>
            <span className="font-bold text-gray-800">{gaPropertyId}</span>
          </p>
        )}
      </div>
    </>
  );
};

export default GaAuthAndSettings;