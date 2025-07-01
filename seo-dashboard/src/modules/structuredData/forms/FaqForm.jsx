// forms/FaqForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import PreviewBox from '../PreviewBox';

const FaqForm = ({ onDataChange }) => {
  const [url, setUrl] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": answer,
        },
      },
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/structured-data/faq`, { url, jsonLD });
      setMessage('✅ FAQ added');
      setUrl('');
      setQuestion('');
      setAnswer('');
      if (onDataChange) onDataChange();
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Add FAQ Structured Data</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="url"
          placeholder="Page URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
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

export default FaqForm;



