// src/modules/Analytics/components/GaReportViewer.jsx
import React from 'react';

const GaReportViewer = ({ report }) => {
  if (!report || report.length === 0) {
    return <p className="text-gray-600 text-center py-4">No report data available for the last 7 days.</p>;
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-lg shadow-inner border border-gray-100">
      <h3 className="text-md font-semibold text-gray-700 mb-4 px-4 pt-4">Page Performance (Last 7 Days)</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Path</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Views</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Users</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Duration (min)</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement Rate</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {report.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 break-words max-w-xs overflow-hidden text-ellipsis">
                {row.pagePath}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.screenPageViews}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.newUsers}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.sessions}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.averageSessionDuration}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.engagementRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GaReportViewer;