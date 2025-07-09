// src/modules/Analytics/AnalyticsDashboard.jsx
import { useEffect, useState, useCallback } from 'react';
import {
  fetchGaReport,
  listGtmAccounts,
} from '../../api/analyticsApi';
import {
  getAllGtmEvents,
  createGtmEvent,
  updateGtmEvent,
  deleteGtmEvent,
} from '../../api/gtmApi'; // Ensure this file is updated as per backend contract
import { toast } from 'react-toastify';

import GaReportViewer from './components/GaReportViewer';
import GtmAccountSelector from './components/GtmAccountSelector';
import GtmEventList from './components/GtmEventList';
import GtmEventForm from './components/GtmEventForm';
import CustomEventReportComponent from './components/CustomEventReportComponent';

const AnalyticsDashboard = ({ gaConnected, gaPropertyId }) => {
  // GA Report State
  const [gaReportData, setGaReportData] = useState([]);
  const [gaReportLoading, setGaReportLoading] = useState(false);
  const [gaReportError, setGaReportError] = useState(null);

  // GTM State
  const [gtmEvents, setGtmEvents] = useState([]);
  const [gtmEventsLoading, setGtmEventsLoading] = useState(false);
  const [gtmEventsError, setGtmEventsError] = useState(null);
  const [selectedGtmEvent, setSelectedGtmEvent] = useState(null); // For editing
  const [showGtmEventForm, setShowGtmEventForm] = useState(false);

  // GTM Account/Container State
  const [gtmAccounts, setGtmAccounts] = useState([]);
  const [selectedGtmAccount, setSelectedGtmAccount] = useState(null);
  const [selectedGtmContainer, setSelectedGtmContainer] = useState(null);
  const [gtmAccountsLoading, setGtmAccountsLoading] = useState(false);
  const [gtmAccountsError, setGtmAccountsError] = useState(null);

  // Function to load GA Report data
  const loadGaReport = useCallback(async () => {
    setGaReportLoading(true);
    setGaReportError(null);
    try {
      if (gaConnected && gaPropertyId) {
        const reportRes = await fetchGaReport();
        setGaReportData(reportRes.report);
        if (reportRes.report && reportRes.report.length === 0) {
            toast.info('No GA4 report data available for the last 7 days.', { autoClose: 3000 });
        }
      } else {
        setGaReportData([]);
        setGaReportError('Google Analytics not fully configured or authorized. Please check connection and Property ID in settings.');
      }
    } catch (err) {
      console.error('Error fetching GA report:', err);
      setGaReportError(`Failed to load GA report: ${err.response?.data || err.message || 'Unknown error'}.`);
      toast.error(`Failed to load GA report: ${err.response?.data || err.message || 'Unknown error'}.`, { autoClose: 5000 });
    } finally {
      setGaReportLoading(false);
    }
  }, [gaConnected, gaPropertyId]);

  // Function to load GTM Accounts
  const loadGtmAccounts = useCallback(async () => {
    setGtmAccountsLoading(true);
    setGtmAccountsError(null);
    try {
      const accounts = await listGtmAccounts();
      setGtmAccounts(accounts);
      if (accounts.length > 0 && accounts[0].containers.length > 0) {
        setSelectedGtmAccount(accounts[0].accountId);
        setSelectedGtmContainer(accounts[0].containers[0].containerId);
      }
    } catch (err) {
      console.error('Error fetching GTM accounts:', err);
      setGtmAccountsError(`Failed to load GTM accounts: ${err.response?.data || err.message || 'Unknown error'}. Ensure proper GTM API scopes.`);
      toast.error(`Failed to load GTM accounts: ${err.response?.data || err.message || 'Unknown error'}.`, { autoClose: 7000 });
    } finally {
      setGtmAccountsLoading(false);
    }
  }, []);

  // Function to load GTM Events
  const loadGtmEvents = useCallback(async () => {
    setGtmEventsLoading(true);
    setGtmEventsError(null);
    try {
      const events = await getAllGtmEvents();
      setGtmEvents(events);
    } catch (err) {
      console.error('Error fetching GTM events:', err);
      setGtmEventsError(`Failed to load GTM events: ${err.response?.data?.error || err.message || 'Unknown error'}.`);
      toast.error(`Failed to load GTM events: ${err.response?.data?.error || err.message || 'Unknown error'}.`, { autoClose: 5000 });
    } finally {
      setGtmEventsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (gaConnected && gaPropertyId) {
      loadGaReport();
    } else {
        setGaReportData([]);
        setGaReportError(null);
        setGaReportLoading(false);
    }
    if (gaConnected) {
      loadGtmAccounts();
      loadGtmEvents();
    } else {
        setGtmAccounts([]);
        setGtmAccountsError(null);
        setGtmAccountsLoading(false);
        setGtmEvents([]);
        setGtmEventsError(null);
        setGtmEventsLoading(false);
    }
  }, [gaConnected, gaPropertyId, loadGaReport, loadGtmAccounts, loadGtmEvents]);

  const handleCreateOrUpdateGtmEvent = async (eventData) => {
    setGtmEventsLoading(true);
    try {
      let result;
      if (selectedGtmEvent) {
        // This is an update operation
        // Merge existing GTM IDs and database _id with form data
        const payload = {
          _id: selectedGtmEvent._id,
          gtmTagId: selectedGtmEvent.gtmTagId,
          gtmTriggerId: selectedGtmEvent.gtmTriggerId,
          ...eventData // Contains name, eventName, category, label, triggerType, selector
        };
        result = await updateGtmEvent(payload); // Pass the merged payload
        toast.success('GTM Event updated successfully!', { autoClose: 3000 });
      } else {
        // Create returns the full event object including GTM IDs
        result = await createGtmEvent(eventData);
        toast.success('GTM Event created successfully!', { autoClose: 3000 });
        console.log("Created GTM Event:", result); // Log for debugging
      }
      loadGtmEvents(); // Refresh the list
      setShowGtmEventForm(false);
      setSelectedGtmEvent(null);
    } catch (error) {
      console.error('Error saving GTM event:', error);
      toast.error(`Error saving GTM event: ${error.message || error}`, { autoClose: 5000 });
    } finally {
      setGtmEventsLoading(false);
    }
  };

  const handleEditGtmEvent = (event) => {
    setSelectedGtmEvent(event);
    setShowGtmEventForm(true);
  };

  const handleDeleteGtmEvent = async (eventToDelete) => {
    if (!window.confirm('Are you sure you want to delete this GTM event from Google Tag Manager?')) {
      return;
    }
    setGtmEventsLoading(true);
    try {
      // Pass gtmTagId and gtmTriggerId to the API in an object for deletion
      await deleteGtmEvent({ gtmTagId: eventToDelete.gtmTagId, gtmTriggerId: eventToDelete.gtmTriggerId });
      toast.success('GTM Event deleted successfully!', { autoClose: 3000 });
      loadGtmEvents(); // Reload GTM events
    } catch (err) {
      console.error('Error deleting GTM event:', err);
      toast.error(`Failed to delete GTM event: ${err.response?.data?.error || err.message}`, { autoClose: 5000 });
    } finally {
      setGtmEventsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-300">Analytics & GTM Dashboard</h2>

      <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-200">
          Google Analytics 4 Report
        </h3>
        {gaReportLoading && <div className="text-gray-600 text-center py-4">Loading GA4 report...</div>}
        {gaReportError && <div className="text-red-500 text-center py-4">Error: {gaReportError}</div>}
        {!gaReportLoading && !gaReportError && gaConnected && gaPropertyId ? (
          <GaReportViewer report={gaReportData} />
        ) : (
            !gaConnected && <p className="text-gray-600 text-center py-4">Please connect your Google Analytics account and set the GA4 Property ID in the settings section above to view reports.</p>
        )}
        <div className="mt-8">
              <CustomEventReportComponent />
          </div>
      </section>

      <section className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-200">
          Google Tag Manager Configuration
        </h3>

        {gaConnected && (
          <GtmAccountSelector
              accounts={gtmAccounts}
              selectedAccount={selectedGtmAccount}
              selectedContainer={selectedGtmContainer}
              onAccountChange={setSelectedGtmAccount}
              onContainerChange={setSelectedGtmContainer}
              loading={gtmAccountsLoading}
              error={gtmAccountsError}
          />
        )}

        <button
          onClick={() => { setShowGtmEventForm(true); setSelectedGtmEvent(null); }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg mt-6"
        >
          {showGtmEventForm && !selectedGtmEvent ? 'Creating New Event...' : 'Create New GTM Event'}
        </button>

        {showGtmEventForm && (
          <div className="mt-8">
            <GtmEventForm
              event={selectedGtmEvent}
              onSubmit={handleCreateOrUpdateGtmEvent}
              onCancel={() => { setShowGtmEventForm(false); setSelectedGtmEvent(null); }}
            />
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-700 mb-4 mt-8">Configured GTM Events:</h3>
        <GtmEventList
          events={gtmEvents}
          onEdit={handleEditGtmEvent}
          onDelete={handleDeleteGtmEvent}
          loading={gtmEventsLoading}
          error={gtmEventsError}
        />
      </section>
    </div>
  );
};

export default AnalyticsDashboard;