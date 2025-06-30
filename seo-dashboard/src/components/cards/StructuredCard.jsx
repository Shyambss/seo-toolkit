import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const contentTypes = ['blog', 'faq', 'event', 'testimonial'];

const StructuredCard = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const results = await Promise.all(
          contentTypes.map(type =>
            axios.get(`/api/structured-data/${type}/count`).then(res => ({
              type,
              count: res.data.count || 0,
            }))
          )
        );

        const countsObj = {};
        results.forEach(({ type, count }) => {
          countsObj[type] = count;
        });

        setCounts(countsObj);
      } catch (err) {
        console.error('Error fetching structured data counts:', err);
        setError('Failed to load structured data stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const totalCount = Object.values(counts).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-2">Structured Data</h3>

      {loading && <p className="text-sm text-gray-600">Loading data...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <p className="text-2xl font-bold text-blue-600">{totalCount} Entries</p>

          <div className="mt-2 text-sm text-gray-700 space-y-1">
            {contentTypes.map(type => (
              <p key={type}>
                <strong>{type.charAt(0).toUpperCase() + type.slice(1)}:</strong> {counts[type] || 0}
              </p>
            ))}
          </div>

          <div className="mt-3">
            <Link
              to="/structured-data"
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

export default StructuredCard;
