// forms/EventForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import PreviewBox from '../PreviewBox';

const EventForm = ({ onDataChange }) => {
  const [form, setForm] = useState({
    url: '',
    name: '',
    startDate: '',
    endDate: '',
    location: '',
    performer: '',
    description: '',
  });
  const [message, setMessage] = useState('');

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": form.name,
    "startDate": form.startDate,
    "endDate": form.endDate,
    "location": { "@type": "Place", "name": form.location },
    "performer": { "@type": "Person", "name": form.performer },
    "description": form.description,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/structured-data/event', {
        url: form.url,
        jsonLD,
      });
      setMessage('✅ Event structured data added');
      setForm({ url: '', name: '', startDate: '', endDate: '', location: '', performer: '', description: '' });
      if (onDataChange) onDataChange();
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Add Event Structured Data</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="url"
          placeholder="Page URL"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Event Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          placeholder="End Date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Performer"
          value={form.performer}
          onChange={(e) => setForm({ ...form, performer: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>
      {message && <p className="mt-2 text-sm">{message}</p>}
      <PreviewBox jsonLD={JSON.stringify(jsonLD, null, 2)} />
    </div>
  );
};

export default EventForm;

