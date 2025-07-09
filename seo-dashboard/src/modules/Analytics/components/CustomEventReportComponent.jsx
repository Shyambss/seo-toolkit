import React, { useEffect, useState } from 'react';
import { fetchCustomEventReport } from "../../../api/analyticsApi";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function CustomEventReportComponent() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (rawDate) => {
    if (!rawDate || rawDate.length !== 8) return rawDate;
    const year = rawDate.slice(0, 4);
    const month = rawDate.slice(4, 6);
    const day = rawDate.slice(6, 8);
    return `${year}-${month}-${day}`;
  };

  const loadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCustomEventReport(null, '30daysAgo', 'today');
      setReportData(data?.report?.report || []);
    } catch (err) {
      console.error("Failed to load custom event report:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const aggregatedByEvent = reportData.reduce((acc, item) => {
    acc[item.eventName] = (acc[item.eventName] || 0) + item.eventCount;
    return acc;
  }, {});

  const chartDataForEventCount = Object.keys(aggregatedByEvent).map(name => ({
    name,
    'Event Count': aggregatedByEvent[name]
  }));

  const dailyTrendData = reportData.reduce((acc, item) => {
    const formatted = formatDate(item.date);
    if (!acc[formatted]) acc[formatted] = 0;
    acc[formatted] += item.eventCount;
    return acc;
  }, {});

  const formattedDailyTrend = Object.keys(dailyTrendData).map(date => ({
    date,
    'Total Events': dailyTrendData[date]
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  if (loading) return <div className="p-4 text-center">Loading custom event report...</div>;
  if (error) return <div className="p-4 text-red-600 text-center">Error loading report: {error.message}</div>;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Event Tracking Report</h2>

      {reportData.length > 0 ? (
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-700">Total Event Counts by Event Name</h3>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartDataForEventCount} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Event Count" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-3 text-gray-700">Daily Total Events Trend</h3>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedDailyTrend} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Total Events" stroke="#82ca9d" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-8">No event data found for the past 30 days.</p>
      )}
    </div>
  );
}

export default CustomEventReportComponent;
