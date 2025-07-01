import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_BASE_URL;
const sitemapUrl = `${API}/sitemap.xml`

const SitemapCard = () => {
  const [count, setCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [recentUrls, setRecentUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSitemapData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/sitemap/get-pages`);
        const pages = res.data || [];

        setCount(pages.length);

        if (pages.length > 0) {
          const sorted = [...pages].sort(
            (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
          );

          const latestDate = new Date(sorted[0].lastModified);
          setLastUpdated(latestDate);

          const top3Urls = sorted.slice(0, 3).map(p => p.url);
          setRecentUrls(top3Urls);
        } else {
          setLastUpdated(null);
          setRecentUrls([]);
        }
      } catch (err) {
        console.error('Error fetching sitemap data:', err);
        setError('Failed to load sitemap data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSitemapData();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-2">XML Sitemap</h3>

      {loading && <p className="text-sm text-gray-600">Loading sitemap data...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <p className="text-2xl font-bold text-blue-600">{count} URLs</p>

          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-semibold">Last Updated:</span>{' '}
              {lastUpdated ? lastUpdated.toLocaleString() : 'N/A'}
            </p>

            <p className="pt-1 font-semibold">Recently Added URLs:</p>
            <ul className="list-disc ml-5 text-gray-800">
              {recentUrls.map((url, idx) => (
                <li key={idx} className="break-all">
                  {url}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 flex flex-col space-y-1 text-sm">
            <Link
              to="/sitemap"
              className="text-blue-500 hover:underline font-medium"
            >
              View Module →
            </Link>
            <a
              href={sitemapUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline font-medium"
            >
              View Sitemap →
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default SitemapCard;
