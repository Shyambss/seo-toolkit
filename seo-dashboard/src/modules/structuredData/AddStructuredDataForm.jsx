// src/modules/structuredData/AddStructuredDataForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import PreviewBox from './PreviewBox';

const AddStructuredDataForm = ({ type }) => {
  const [jsonLD, setJsonLD] = useState('{}');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(jsonLD);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/structured-data/${type}`, { jsonLD: parsed });
      setMessage('✅ Structured data added successfully');
      setJsonLD('{}');
    } catch (error) {
      setMessage('❌ Error: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Add New {type} Structured Data</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={jsonLD}
          onChange={(e) => setJsonLD(e.target.value)}
          rows="10"
          className="w-full border p-2 rounded font-mono text-sm"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Structured Data
        </button>
      </form>
      {message && <p className="mt-2 text-sm">{message}</p>}
      <PreviewBox jsonLD={jsonLD} />
    </div>
  );
};

export default AddStructuredDataForm;
