<<<<<<< HEAD
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import PerformanceResults from "./PerformanceResults";

const frequencyToMs = {
  hourly: 1000 * 60 * 60,
  daily: 1000 * 60 * 60 * 24,
  weekly: 1000 * 60 * 60 * 24 * 7,
};

const Performance = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  // For tracked site URL + frequency (frequency empty means manual analysis)
  const [trackedSite, setTrackedSite] = useState({ url: "", frequency: "" });
  const [trackedSiteLoading, setTrackedSiteLoading] = useState(false);
  const [trackedSiteError, setTrackedSiteError] = useState("");

  const intervalRef = useRef(null);

  // Fetch saved reports
  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/performance/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  // Fetch tracked site info
  const fetchTrackedSite = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/performance/tracked");
      if (res.data && res.data.url) {
        setTrackedSite({
          url: res.data.url,
          frequency: res.data.frequency || "",
        });
        fetchLatestReport(res.data.url);
      }
    } catch (err) {
      console.error("Failed to fetch tracked site", err);
    }
  };

  // Fetch latest report for given URL
  const fetchLatestReport = async (url) => {
    try {
      const res = await axios.get("http://localhost:5000/api/performance/reports");
      // Filter reports for the tracked URL, pick latest
      const filtered = res.data.filter((r) => r.url === url);
      if (filtered.length > 0) {
        // Sort descending by date
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        setResult(filtered[0]);
      } else {
        setResult(null);
      }
    } catch (err) {
      console.error("Failed to fetch latest report", err);
    }
  };

  // Analyze a URL (manual or tracked)
  const handleAnalyze = async (url) => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/performance/analyze", {
        params: { url },
      });
      setResult(response.data);
      fetchReports();
    } catch (err) {
      console.error("Failed to analyze URL", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a report
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/performance/reports/${id}`);
      fetchReports();
      // Also refresh tracked site's latest report if relevant
      if (result && result._id === id) {
        fetchLatestReport(trackedSite.url);
      }
    } catch (err) {
      console.error("Failed to delete report", err);
    }
  };

  // Setup auto refresh interval based on frequency
  const setupAutoRefresh = (frequency, url) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    const intervalMs = frequencyToMs[frequency] || frequencyToMs.daily;
    intervalRef.current = setInterval(() => {
      if (url) {
        handleAnalyze(url);
      }
    }, intervalMs);
  };

  // Manual re-analyze tracked site
  const handleReanalyzeTrackedSite = () => {
    if (trackedSite.url) {
      handleAnalyze(trackedSite.url);
    }
  };

  // On mount: load reports and tracked site
  useEffect(() => {
    fetchReports();
    fetchTrackedSite();
  }, []);

  // Setup auto refresh whenever trackedSite frequency/url changes
  useEffect(() => {
    if (trackedSite.frequency && trackedSite.url) {
      setupAutoRefresh(trackedSite.frequency, trackedSite.url);
    } else {
      // Clear interval if tracking disabled
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    // Clear interval on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trackedSite.frequency, trackedSite.url]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Performance Tracking</h1>

      {/* Combined Smart Form */}
      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">Website Performance Analysis</h2>

        <label className="block mb-2 font-medium">Website URL</label>
        <input
          type="text"
          value={trackedSite.url}
          onChange={(e) => setTrackedSite({ ...trackedSite, url: e.target.value })}
          placeholder="https://example.com"
          className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:ring"
          disabled={trackedSiteLoading || loading}
        />

        <label className="inline-flex items-center mb-4">
          <input
            type="checkbox"
            checked={!!trackedSite.frequency}
            onChange={(e) =>
              setTrackedSite((prev) => ({
                ...prev,
                frequency: e.target.checked ? "daily" : "", // default daily if checked
              }))
            }
            className="mr-2"
            disabled={trackedSiteLoading || loading}
          />
          Enable scheduled tracking
        </label>
        <br></br>

        {trackedSite.frequency && (
          <>
            <label className="block mt-2 mb-2 font-medium">Tracking Frequency</label>
            <select
              value={trackedSite.frequency}
              onChange={(e) =>
                setTrackedSite({ ...trackedSite, frequency: e.target.value })
              }
              className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:ring"
              disabled={trackedSiteLoading || loading}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </>
        )}

        {trackedSiteError && <p className="text-red-600 mb-2">{trackedSiteError}</p>}

        <button
          onClick={async () => {
            if (!trackedSite.url.trim()) {
              setTrackedSiteError("Website URL is required");
              return;
            }

            setTrackedSiteError("");
            setTrackedSiteLoading(true);

            try {
              if (trackedSite.frequency) {
                // Save tracked site to backend for scheduled tracking
                await axios.post("http://localhost:5000/api/performance/tracked", {
                  url: trackedSite.url.trim(),
                  frequency: trackedSite.frequency,
                });
                fetchLatestReport(trackedSite.url.trim());
                setupAutoRefresh(trackedSite.frequency, trackedSite.url.trim());
              } else {
                // One-time immediate analysis
                await handleAnalyze(trackedSite.url.trim());
              }
              fetchReports();
            } catch (err) {
              console.error("Error processing request", err);
              setTrackedSiteError("Something went wrong");
            } finally {
              setTrackedSiteLoading(false);
            }
          }}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          disabled={trackedSiteLoading || loading}
        >
          {trackedSiteLoading || loading
            ? trackedSite.frequency
              ? "Saving & Analyzing..."
              : "Analyzing..."
            : trackedSite.frequency
              ? "Save & Track"
              : "Analyze Now"}
        </button>

        {/* Optional Re-analyze button when tracking is enabled */}
        {trackedSite.frequency && trackedSite.url && (
          <button
            onClick={handleReanalyzeTrackedSite}
            disabled={loading || trackedSiteLoading}
            className="ml-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Analyzing..." : "analyze Now"}
          </button>
        )}
      </div>

      {/* Show latest tracked site analysis */}
      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Latest Tracked Site Report</h2>
          <PerformanceResults result={result} />
        </div>
      )}

      {/* Previous Reports List */}
      <div>
        <h2 className="text-xl font-semibold mt-8 mb-4">Previous Reports</h2>
        <div className="space-y-4">
          {reports.length === 0 ? (
            <p>No reports found.</p>
          ) : (
            reports.map((report) => (
              <div
                key={report._id}
                className="border p-4 rounded-md shadow-sm flex justify-between items-start"
              >
                <div>
                  <p>
                    <strong>URL:</strong> {report.url}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(report.date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Score:</strong> {report.performance_score}
                  </p>
                  <p>
                    <strong>LCP:</strong> {report.lcp}ms
                  </p>
                  <p>
                    <strong>TTFB:</strong> {report.ttfb}ms
                  </p>
                  <p>
                    <strong>CLS:</strong> {report.cls}
                  </p>
                  <details className="mt-2">
                    <summary className="text-blue-600 cursor-pointer">Suggestions</summary>
                    <pre className="bg-gray-100 p-2 mt-1 rounded whitespace-pre-wrap">
                      {report.suggestions}
                    </pre>
                  </details>
                </div>
                <button
                  onClick={() => handleDelete(report._id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Performance;
=======
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import PerformanceResults from "./PerformanceResults";

const frequencyToMs = {
  hourly: 1000 * 60 * 60,
  daily: 1000 * 60 * 60 * 24,
  weekly: 1000 * 60 * 60 * 24 * 7,
};

const Performance = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  // For tracked site URL + frequency (frequency empty means manual analysis)
  const [trackedSite, setTrackedSite] = useState({ url: "", frequency: "" });
  const [trackedSiteLoading, setTrackedSiteLoading] = useState(false);
  const [trackedSiteError, setTrackedSiteError] = useState("");

  const intervalRef = useRef(null);

  // Fetch saved reports
  const fetchReports = async () => {
    try {
      const res = await axios.get("https://seo-toolkit-08ge.onrender.com/api/performance/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  // Fetch tracked site info
  const fetchTrackedSite = async () => {
    try {
      const res = await axios.get("https://seo-toolkit-08ge.onrender.com/api/performance/tracked");
      if (res.data && res.data.url) {
        setTrackedSite({
          url: res.data.url,
          frequency: res.data.frequency || "",
        });
        fetchLatestReport(res.data.url);
      }
    } catch (err) {
      console.error("Failed to fetch tracked site", err);
    }
  };

  // Fetch latest report for given URL
  const fetchLatestReport = async (url) => {
    try {
      const res = await axios.get("https://seo-toolkit-08ge.onrender.com/api/performance/reports");
      // Filter reports for the tracked URL, pick latest
      const filtered = res.data.filter((r) => r.url === url);
      if (filtered.length > 0) {
        // Sort descending by date
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        setResult(filtered[0]);
      } else {
        setResult(null);
      }
    } catch (err) {
      console.error("Failed to fetch latest report", err);
    }
  };

  // Analyze a URL (manual or tracked)
  const handleAnalyze = async (url) => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await axios.get("https://seo-toolkit-08ge.onrender.com/api/performance/analyze", {
        params: { url },
      });
      setResult(response.data);
      fetchReports();
    } catch (err) {
      console.error("Failed to analyze URL", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a report
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://seo-toolkit-08ge.onrender.com/api/performance/reports/${id}`);
      fetchReports();
      // Also refresh tracked site's latest report if relevant
      if (result && result._id === id) {
        fetchLatestReport(trackedSite.url);
      }
    } catch (err) {
      console.error("Failed to delete report", err);
    }
  };

  // Setup auto refresh interval based on frequency
  const setupAutoRefresh = (frequency, url) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    const intervalMs = frequencyToMs[frequency] || frequencyToMs.daily;
    intervalRef.current = setInterval(() => {
      if (url) {
        handleAnalyze(url);
      }
    }, intervalMs);
  };

  // Manual re-analyze tracked site
  const handleReanalyzeTrackedSite = () => {
    if (trackedSite.url) {
      handleAnalyze(trackedSite.url);
    }
  };

  // On mount: load reports and tracked site
  useEffect(() => {
    fetchReports();
    fetchTrackedSite();
  }, []);

  // Setup auto refresh whenever trackedSite frequency/url changes
  useEffect(() => {
    if (trackedSite.frequency && trackedSite.url) {
      setupAutoRefresh(trackedSite.frequency, trackedSite.url);
    } else {
      // Clear interval if tracking disabled
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    // Clear interval on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trackedSite.frequency, trackedSite.url]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Performance Tracking</h1>

      {/* Combined Smart Form */}
      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">Website Performance Analysis</h2>

        <label className="block mb-2 font-medium">Website URL</label>
        <input
          type="text"
          value={trackedSite.url}
          onChange={(e) => setTrackedSite({ ...trackedSite, url: e.target.value })}
          placeholder="https://example.com"
          className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:ring"
          disabled={trackedSiteLoading || loading}
        />

        <label className="inline-flex items-center mb-4">
          <input
            type="checkbox"
            checked={!!trackedSite.frequency}
            onChange={(e) =>
              setTrackedSite((prev) => ({
                ...prev,
                frequency: e.target.checked ? "daily" : "", // default daily if checked
              }))
            }
            className="mr-2"
            disabled={trackedSiteLoading || loading}
          />
          Enable scheduled tracking
        </label>
        <br></br>

        {trackedSite.frequency && (
          <>
            <label className="block mt-2 mb-2 font-medium">Tracking Frequency</label>
            <select
              value={trackedSite.frequency}
              onChange={(e) =>
                setTrackedSite({ ...trackedSite, frequency: e.target.value })
              }
              className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:ring"
              disabled={trackedSiteLoading || loading}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </>
        )}

        {trackedSiteError && <p className="text-red-600 mb-2">{trackedSiteError}</p>}

        <button
          onClick={async () => {
            if (!trackedSite.url.trim()) {
              setTrackedSiteError("Website URL is required");
              return;
            }

            setTrackedSiteError("");
            setTrackedSiteLoading(true);

            try {
              if (trackedSite.frequency) {
                // Save tracked site to backend for scheduled tracking
                await axios.post("https://seo-toolkit-08ge.onrender.com/api/performance/tracked", {
                  url: trackedSite.url.trim(),
                  frequency: trackedSite.frequency,
                });
                fetchLatestReport(trackedSite.url.trim());
                setupAutoRefresh(trackedSite.frequency, trackedSite.url.trim());
              } else {
                // One-time immediate analysis
                await handleAnalyze(trackedSite.url.trim());
              }
              fetchReports();
            } catch (err) {
              console.error("Error processing request", err);
              setTrackedSiteError("Something went wrong");
            } finally {
              setTrackedSiteLoading(false);
            }
          }}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          disabled={trackedSiteLoading || loading}
        >
          {trackedSiteLoading || loading
            ? trackedSite.frequency
              ? "Saving & Analyzing..."
              : "Analyzing..."
            : trackedSite.frequency
              ? "Save & Track"
              : "Analyze Now"}
        </button>

        {/* Optional Re-analyze button when tracking is enabled */}
        {trackedSite.frequency && trackedSite.url && (
          <button
            onClick={handleReanalyzeTrackedSite}
            disabled={loading || trackedSiteLoading}
            className="ml-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Analyzing..." : "analyze Now"}
          </button>
        )}
      </div>

      {/* Show latest tracked site analysis */}
      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Latest Tracked Site Report</h2>
          <PerformanceResults result={result} />
        </div>
      )}

      {/* Previous Reports List */}
      <div>
        <h2 className="text-xl font-semibold mt-8 mb-4">Previous Reports</h2>
        <div className="space-y-4">
          {reports.length === 0 ? (
            <p>No reports found.</p>
          ) : (
            reports.map((report) => (
              <div
                key={report._id}
                className="border p-4 rounded-md shadow-sm flex justify-between items-start"
              >
                <div>
                  <p>
                    <strong>URL:</strong> {report.url}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(report.date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Score:</strong> {report.performance_score}
                  </p>
                  <p>
                    <strong>LCP:</strong> {report.lcp}ms
                  </p>
                  <p>
                    <strong>TTFB:</strong> {report.ttfb}ms
                  </p>
                  <p>
                    <strong>CLS:</strong> {report.cls}
                  </p>
                  <details className="mt-2">
                    <summary className="text-blue-600 cursor-pointer">Suggestions</summary>
                    <pre className="bg-gray-100 p-2 mt-1 rounded whitespace-pre-wrap">
                      {report.suggestions}
                    </pre>
                  </details>
                </div>
                <button
                  onClick={() => handleDelete(report._id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Performance;
>>>>>>> 6f38cf4 (Update frontend with latest changes)
