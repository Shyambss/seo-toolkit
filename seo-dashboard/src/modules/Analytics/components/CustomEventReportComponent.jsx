import React, { useEffect, useState } from 'react';
import { fetchCustomEventReport } from "../../../api/analyticsApi";import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function CustomEventReportComponent() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('ALL_CUSTOM_EVENTS'); // Default to all custom events
  const [startDate, setStartDate] = useState('30daysAgo');
  const [endDate, setEndDate] = useState('today');

  const loadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass null for eventName if you want "ALL_CUSTOM_EVENTS" logic from backend
      // Your backend will handle the 'Tag - ' prefix filtering when eventName is null.
      const data = await fetchCustomEventReport(
        selectedEvent === 'ALL_CUSTOM_EVENTS' ? null : selectedEvent,
        startDate,
        endDate
      );
      setReportData(data.report); // Assuming your backend returns { report: [...] }
    } catch (err) {
      console.error("Failed to load custom event report:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to load report whenever filters change
  useEffect(() => {
    loadReport();
  }, [selectedEvent, startDate, endDate]);

  // Data processing for charts
  // 1. Aggregate total event counts by individual event name (for the first chart)
  const aggregatedByEvent = reportData.reduce((acc, item) => {
    acc[item.eventName] = (acc[item.eventName] || 0) + item.eventCount;
    return acc;
  }, {});

  const chartDataForEventCount = Object.keys(aggregatedByEvent).map(key => ({
    name: key, // Event Name
    'Event Count': aggregatedByEvent[key]
  }));

  // 2. Aggregate daily total event counts (for the second chart)
  const dailyTrendData = reportData.reduce((acc, item) => {
      if (!acc[item.date]) {
          acc[item.date] = 0;
      }
      acc[item.date] += item.eventCount;
      return acc;
  }, {});

  // Convert to array and sort by date for the trend chart
  const formattedDailyTrend = Object.keys(dailyTrendData).map(date => ({
      date,
      'Total Events': dailyTrendData[date]
  })).sort((a,b) => new Date(a.date) - new Date(b.date));


  // Extract unique event names for the dropdown filter
  const uniqueEventNames = [...new Set(reportData.map(item => item.eventName))].sort();


  if (loading) return <div className="p-4 text-center">Loading custom event report...</div>;
  if (error) return <div className="p-4 text-red-600 text-center">Error loading report: {error.message}. Please ensure GA4 is connected and property ID is set.</div>;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Custom Event Tracking</h2>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="eventNameSelect" className="block text-sm font-medium text-gray-700 mb-1">Select Event:</label>
          <select
            id="eventNameSelect"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
          >
            <option value="ALL_CUSTOM_EVENTS">All Custom Events (Tagged with 'Tag - ')</option>
            {uniqueEventNames.map(event => (
              <option key={event} value={event}>{event}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date:</label>
          <input
            type="text" // Use "date" type if you want native date picker, or integrate a custom one
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="e.g., 30daysAgo or YYYY-MM-DD"
            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date:</label>
          <input
            type="text" // Use "date" type if you want native date picker, or integrate a custom one
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="e.g., today or YYYY-MM-DD"
            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Conditional Rendering of Charts and Table */}
      {reportData.length > 0 ? (
        <div>
          {/* Chart 1: Total Event Counts by Event Name */}
          <h3 className="text-xl font-semibold mt-8 mb-3 text-gray-700">Total Event Counts by Event Name</h3>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartDataForEventCount}
                margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Event Count" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Daily Event Trend */}
          <h3 className="text-xl font-semibold mt-8 mb-3 text-gray-700">Daily Event Trend ({selectedEvent === 'ALL_CUSTOM_EVENTS' ? 'All Tagged Events' : selectedEvent})</h3>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={formattedDailyTrend}
                margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Total Events" stroke="#82ca9d" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Raw Data Table */}
          <h3 className="text-xl font-semibold mt-8 mb-3 text-gray-700">Raw Data</h3>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Count</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Users</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.eventName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.eventCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalUsers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-8">
          No custom event data found for the selected period or filters.
          Ensure you have custom events with the "Tag - " prefix in your GA4 property
          and that the correct GA4 Property ID is configured.
        </p>
      )}
    </div>
  );
}

export default CustomEventReportComponent;