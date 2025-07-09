// src/modules/Analytics/components/GtmEventList.jsx
import React from 'react';

const GtmEventList = ({ events, onEdit, onDelete, loading, error }) => {
  if (loading) return <div className="text-gray-600 text-center py-4">Loading GTM events...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  if (!events || events.length === 0) return <p className="text-gray-600 text-center py-4">No GTM events configured yet in the database.</p>;

  return (
    <div className="mt-6 overflow-x-auto rounded-lg shadow-inner border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GA4 Event Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trigger Type</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CSS Selector</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GTM Tag ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GTM Trigger ID</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event) => (
            <tr key={event._id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 break-words max-w-[200px]">{event.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.eventName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.triggerType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 break-words max-w-[200px]">{event.selector}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.gtmTagId || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.gtmTriggerId || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(event)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(event)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GtmEventList;