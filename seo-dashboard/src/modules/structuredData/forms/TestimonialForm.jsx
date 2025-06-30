<<<<<<< HEAD
// forms/TestimonialForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import PreviewBox from '../PreviewBox';

const TestimonialForm = ({ onDataChange }) => {
  const [form, setForm] = useState({
    url: '',
    reviewer: '',
    reviewRating: '',
    reviewBody: '',
  });
  const [message, setMessage] = useState('');

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": form.reviewer,
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": form.reviewRating,
    },
    "reviewBody": form.reviewBody,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/structured-data/testimonial', {
        url: form.url,
        jsonLD,
      });
      setMessage('✅ Testimonial structured data added');
      setForm({ url: '', reviewer: '', reviewRating: '', reviewBody: '' });
      if (onDataChange) onDataChange();
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Add Testimonial Structured Data</h2>
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
          placeholder="Reviewer Name"
          value={form.reviewer}
          onChange={(e) => setForm({ ...form, reviewer: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1 to 5)"
          value={form.reviewRating}
          onChange={(e) => setForm({ ...form, reviewRating: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Review Content"
          value={form.reviewBody}
          onChange={(e) => setForm({ ...form, reviewBody: e.target.value })}
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

export default TestimonialForm;
=======
// forms/TestimonialForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import PreviewBox from '../PreviewBox';

const TestimonialForm = ({ onDataChange }) => {
  const [form, setForm] = useState({
    url: '',
    reviewer: '',
    reviewRating: '',
    reviewBody: '',
  });
  const [message, setMessage] = useState('');

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": form.reviewer,
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": form.reviewRating,
    },
    "reviewBody": form.reviewBody,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/structured-data/testimonial', {
        url: form.url,
        jsonLD,
      });
      setMessage('✅ Testimonial structured data added');
      setForm({ url: '', reviewer: '', reviewRating: '', reviewBody: '' });
      if (onDataChange) onDataChange();
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Add Testimonial Structured Data</h2>
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
          placeholder="Reviewer Name"
          value={form.reviewer}
          onChange={(e) => setForm({ ...form, reviewer: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1 to 5)"
          value={form.reviewRating}
          onChange={(e) => setForm({ ...form, reviewRating: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Review Content"
          value={form.reviewBody}
          onChange={(e) => setForm({ ...form, reviewBody: e.target.value })}
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

export default TestimonialForm;
>>>>>>> 6f38cf4 (Update frontend with latest changes)
