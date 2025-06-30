import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CrawlerControls() {
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchStatus = async () => {
    try {
<<<<<<< HEAD
      const res = await axios.get('http://localhost:5000/api/sitemap/status');
=======
      const res = await axios.get('https://seo-toolkit-08ge.onrender.com/api/sitemap/status');
>>>>>>> 6f38cf4 (Update frontend with latest changes)
      setLastChecked(res.data.lastCheckedAt);
    } catch (err) {
      console.error('Failed to fetch crawl status', err);
    }
  };

  const handleCrawl = async () => {
    setLoading(true);
    try {
<<<<<<< HEAD
      await axios.get('http://localhost:5000/api/sitemap/crawl-site');
=======
      await axios.get('https://seo-toolkit-08ge.onrender.com/api/sitemap/crawl-site');
>>>>>>> 6f38cf4 (Update frontend with latest changes)
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
