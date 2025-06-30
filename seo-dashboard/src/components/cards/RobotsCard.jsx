import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RobotsCard = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('/api/robots')
      .then((res) => setInfo(res.data))
      .catch((err) => {
        console.error('Error fetching robots.txt data:', err);
        setError('Failed to load robots.txt stats.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-2">robots.txt</h3>

      {loading && <p className="text-sm text-gray-600">Loading data...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && info && (
        <>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Lines:</strong> {info.stats.lineCount}</p>
            <p><strong>Size:</strong> {info.stats.fileSize} bytes</p>
            <p><strong>User-Agents:</strong> {info.stats.userAgentCount}</p>
            <p><strong>Disallows:</strong> {info.stats.disallowCount}</p>
            <p><strong>Allows:</strong> {info.stats.allowCount}</p>
            <p><strong>Sitemap:</strong> {info.stats.hasSitemap ? 'Present' : 'Absent'}</p>
          </div>

          <div className="mt-3">
            <Link
              to="/robots"
              className="text-blue-500 hover:underline text-sm font-medium"
            >
              View Module →
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default RobotsCard;
