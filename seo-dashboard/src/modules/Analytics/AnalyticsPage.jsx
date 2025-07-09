// src/modules/Analytics/AnalyticsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { checkGAStatus } from '../../api/analyticsApi';
import GaAuthAndSettings from './GaAuthAndSettings';
import AnalyticsDashboard from './AnalyticsDashboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AnalyticsPage = () => {
  const [gaConnected, setGaConnected] = useState(false);
  const [gaPropertyId, setGaPropertyId] = useState('');
  const [loadingStatus, setLoadingStatus] = useState(true);

  const refreshGaStatus = useCallback(async () => {
    setLoadingStatus(true);
    try {
      const status = await checkGAStatus();
      setGaConnected(status.connected);
      setGaPropertyId(status.propertyId || '');
    } catch (err) {
      console.error('Failed to load GA status:', err);
      setGaConnected(false);
      setGaPropertyId('');
      toast.error('Error checking GA connection status.', { autoClose: 3000 });
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    refreshGaStatus();
  }, [refreshGaStatus]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Analytics & Tag Management</h1>

      {/* CHANGE STARTS HERE */}
      {/* Removed grid-cols-1 lg:grid-cols-2 and kept only gap-8 for stacking */}
      <div className="flex flex-col gap-8">
      {/* CHANGE ENDS HERE */}

        {/* Google Analytics Connection & Settings - This will now be at the top */}
        <section className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01]">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-200">
            Google Analytics Connection & Settings
          </h2>
          <GaAuthAndSettings
            gaConnected={gaConnected}
            gaPropertyId={gaPropertyId}
            refreshGaStatus={refreshGaStatus}
            loading={loadingStatus}
          />
        </section>

        {/* Analytics Dashboard (Reports & GTM) - This will now be below the settings */}
        <section className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01]">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-200">
            Analytics Dashboard & GTM Events
          </h2>
          {loadingStatus ? (
            <div className="flex items-center justify-center h-48 text-gray-600">
              <svg className="animate-spin h-6 w-6 mr-3 text-blue-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking GA connection and property ID...
            </div>
          ) : (
            <AnalyticsDashboard
              gaConnected={gaConnected}
              gaPropertyId={gaPropertyId}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default AnalyticsPage;