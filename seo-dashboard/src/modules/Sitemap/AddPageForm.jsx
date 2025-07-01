import { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

export default function AddPageForm() {
  const [url, setUrl] = useState('');
  const [pageType, setPageType] = useState('homepage');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/sitemap/add-page`, { url, pageType });
      alert('Page added successfully');
      setUrl('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding page');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-x-4">
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Page URL" className="px-3 py-1 border border-gray-300 rounded" required />
      <select value={pageType} onChange={(e) => setPageType(e.target.value)} className="px-3 py-1 border border-gray-300 rounded">
        <option value="homepage">Homepage</option>
        <option value="blog">Blog</option>
        <option value="product">Product</option>
        <option value="category">Category</option>
        <option value="about">About</option>
        <option value="static">Static</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Add Page</button>
    </form>
  );
}
