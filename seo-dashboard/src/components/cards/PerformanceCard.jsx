import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PerformanceCard = () => {
  const [reportCount, setReportCount] = useState(0);
  const [latestReport, setLatestReport] = useState(null);
  const [trackedUrl, setTrackedUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPerformanceData = async () => {
      try {
        setLoading(true);
        setError(null);

        const trackedRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/performance/tracked`);
        const trackedData = trackedRes.data;

        if (trackedData?.url) {
          setTrackedUrl(trackedData.url);

          const reportsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/performance/reports`);
          const allReports = reportsRes.data || [];

          const siteReports = allReports
            .filter(report => report.url === trackedData.url)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          setReportCount(siteReports.length);
          if (siteReports.length > 0) {
            setLatestReport(siteReports[0]);
          } else {
            setLatestReport(null);
          }
        } else {
          setTrackedUrl('');
          setReportCount(0);
          setLatestReport(null);
        }
      } catch (err) {
        console.error('Failed to load performance data:', err);
        setError('Failed to load performance data.');
      } finally {
        setLoading(false);
      }
    };

    loadPerformanceData();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-2">Performance</h3>

      {loading && <p className="text-sm text-gray-600">Loading performance reports...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <p className="text-2xl font-bold text-blue-600">{reportCount} Reports</p>

          <div className="mt-2 text-sm text-gray-700 space-y-1">
            {!trackedUrl && <p>No tracked URL configured.</p>}

            {trackedUrl && (
              <>
                <p>
                  <strong>Tracked:</strong> {trackedUrl}
                </p>
                {latestReport ? (
                  <>
                    <p>
                      <strong>Score:</strong> {latestReport.performance_score ?? 'N/A'}
                    </p>
                    <p>
                      <strong>LCP:</strong> {latestReport.lcp ?? 'N/A'} ms
                    </p>
                    <p>
                      <strong>TTFB:</strong> {latestReport.ttfb ?? 'N/A'} ms
                    </p>
                    <p>
                      <strong>CLS:</strong> {latestReport.cls ?? 'N/A'}
                    </p>
                    <p>
                      <strong>Last Checked:</strong>{' '}
                      {new Date(latestReport.date).toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p>No performance reports available.</p>
                )}
              </>
            )}
          </div>

          <div className="mt-3">
            <Link
              to="/performance"
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

export default PerformanceCard;
