// src/modules/structuredData/StructuredDataList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StructuredDataList = ({ type }) => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(`/api/structured-data/${type}`);
    setData(res.data.data);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await axios.delete(`/api/structured-data/${type}/${id}`);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Stored {type} Entries</h2>
      {data.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <ul className="space-y-2">
          {data.map((entry) => (
            <li key={entry._id} className="border p-3 rounded bg-white shadow-sm">
              <div className="text-sm text-blue-700 font-semibold break-all mb-1">
                URL: <a href={entry.url} target="_blank" rel="noopener noreferrer" className="underline">{entry.url}</a>
              </div>
              <div className="text-sm font-mono overflow-x-auto max-h-40 whitespace-pre-wrap bg-gray-50 p-2 rounded">
                {JSON.stringify(entry.jsonLD, null, 2)}
              </div>
              <button
                onClick={() => handleDelete(entry._id)}
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StructuredDataList;
