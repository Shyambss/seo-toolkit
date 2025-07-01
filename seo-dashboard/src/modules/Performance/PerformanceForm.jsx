import { useState } from "react";

const PerformanceForm = ({ onAnalyze }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAnalyze(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded mb-6">
      <label className="block text-sm font-medium mb-2">Website URL</label>
      <input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:ring"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Analyze
      </button>
    </form>
  );
};

export default PerformanceForm;
