// forms/BlogForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import PreviewBox from '../PreviewBox';

const BlogForm = ({ onDataChange }) => {
  const [form, setForm] = useState({
    url: '',
    headline: '',
    author: '',
    datePublished: '',
    description: '',
  });
  const [message, setMessage] = useState('');

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": form.headline,
    "author": { "@type": "Person", "name": form.author },
    "datePublished": form.datePublished,
    "description": form.description,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/structured-data/blog`, {
        url: form.url,
        jsonLD,
      });
      setMessage('✅ Blog structured data added');
      setForm({ url: '', headline: '', author: '', datePublished: '', description: '' });
      if (onDataChange) onDataChange();
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Add Blog Structured Data</h2>
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
          placeholder="Headline"
          value={form.headline}
          onChange={(e) => setForm({ ...form, headline: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          placeholder="Date Published"
          value={form.datePublished}
          onChange={(e) => setForm({ ...form, datePublished: e.target.value })}
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

export default BlogForm;
