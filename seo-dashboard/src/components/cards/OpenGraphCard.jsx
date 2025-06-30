import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OpenGraphCard = () => {
  const [count, setCount] = useState(0);
  const [ogTags, setOgTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOgTags = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get('/api/og-tags/get');
        let tags = res.data || [];

        tags.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setCount(tags.length);
        setOgTags(tags.slice(0, 3));
      } catch (err) {
        console.error("Error fetching Open Graph tags:", err);
        setError("Failed to load Open Graph tags.");
      } finally {
        setLoading(false);
      }
    };

    fetchOgTags();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-2">Open Graph Tags</h3>

      {loading && <p className="text-sm text-gray-600">Loading tags...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <p className="text-2xl font-bold text-blue-600">{count} Tags</p>

          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <p><strong>Recent Entries:</strong></p>
            {ogTags.map((tag, index) => (
              <p key={index}>• {tag.og_title || tag.page_url || 'Untitled'}</p>
            ))}
          </div>

          <div className="mt-3">
            <Link
              to="/open-graph"
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

export default OpenGraphCard;
