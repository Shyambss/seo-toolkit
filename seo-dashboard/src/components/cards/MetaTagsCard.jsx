import { useEffect, useState } from 'react';
import axios from 'axios';

const MetaTagsCard = () => {
  const [count, setCount] = useState(0);
  const [metaTags, setMetaTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get('/api/meta');
        let tags = res.data.metaTags || [];

        // Sort by updatedAt descending (latest updated first)
        tags.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        setCount(tags.length);
        setMetaTags(tags.slice(0, 3)); // latest 3 meta tags
      } catch (err) {
        console.error("Error fetching meta tags:", err);
        setError("Failed to load meta tags.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetaTags();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-2">Meta Tags</h3>

      {loading && <p className="text-sm text-gray-600">Loading meta tags...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <p className="text-2xl font-bold text-blue-600">{count} Tags</p>

          {count === 0 ? (
            <p className="text-sm text-gray-600 mt-2">No meta tags saved yet.</p>
          ) : (
            <>
              <p className="mt-2 text-sm text-gray-700 space-y-1"><strong>Titles:</strong></p>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                {metaTags.map((tag, idx) => (
                  <li key={idx}>
                    {tag.title || (tag.keywords && tag.keywords.join(', ')) || 'Untitled'}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-3">
            <a
              href="/meta-tags"
              className="text-blue-500 hover:underline text-sm font-medium"
            >
              View Module →
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default MetaTagsCard;
