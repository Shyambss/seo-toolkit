import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

export default function CrawlerControls() {
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API}/api/sitemap/status`);
      setLastChecked(res.data.lastCheckedAt);
    } catch (err) {
      console.error('Failed to fetch crawl status', err);
    }
  };

  const handleCrawl = async () => {
    setLoading(true);
    try {
      await axios.get(`${API}/api/sitemap/crawl-site`);
      alert('Crawling completed and sitemap updated!');
      fetchStatus(); // Refresh last crawl time
    } catch (err) {
      alert('Failed to crawl site: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="space-y-2">
      <button
        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 disabled:opacity-50"
        onClick={handleCrawl}
        disabled={loading}
      >
        {loading ? 'Crawling...' : 'Crawl & Update Sitemap'}
      </button>
      <div className="text-sm text-gray-600">
        Last Crawled: {lastChecked ? new Date(lastChecked).toLocaleString() : 'Never'}
      </div>
    </div>
  );
}
