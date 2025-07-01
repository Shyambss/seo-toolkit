// src/modules/structuredData/ViewData.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewData = ({ refresh }) => {
  const [type, setType] = useState('blog');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/structured-data/${type}`);
      if (Array.isArray(res.data.data)) {
        setEntries(res.data.data);
      } else {
        setEntries([]);
      }
    } catch (err) {
      console.error('Error fetching structured data:', err);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      await axios.delete(`/api/structured-data/${type}/${id}`);
      setEntries(entries.filter((entry) => entry._id !== id));
    } catch (err) {
      console.error('Error deleting structured data:', err);
    }
  };

  useEffect(() => {
    if (type) fetchEntries();
  }, [type, refresh]);

  return (
    <div className="border rounded p-4 shadow mt-6">
      <h2 className="text-lg font-bold mb-3">View & Manage Structured Data</h2>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border px-3 py-2 rounded mb-4"
      >
        <option value="blog">Blog</option>
        <option value="faq">FAQ</option>
        <option value="event">Event</option>
        <option value="testimonial">Testimonial</option>
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-auto">
          {entries.map((entry) => (
            <div
              key={entry._id}
              className="bg-gray-100 p-3 rounded relative border"
            >
              <button
                onClick={() => handleDelete(entry._id)}
                className="absolute top-2 right-2 text-sm text-red-500"
              >
                Delete
              </button>
              <div className="text-blue-700 text-sm font-semibold mb-2 break-words">
                URL: <a href={entry.url} target="_blank" rel="noopener noreferrer" className="underline">{entry.url}</a>
              </div>
              <pre className="text-sm whitespace-pre-wrap bg-white p-2 rounded overflow-x-auto">
                {JSON.stringify(entry.jsonLD, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewData;
