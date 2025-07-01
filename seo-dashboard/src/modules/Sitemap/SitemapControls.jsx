import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

export default function SitemapControls() {
  const handleGenerate = async () => {
    await axios.get(`${API}/api/sitemap/generate-sitemap`);
    alert('Sitemap generated successfully!');
  };

  const handleDownload = () => {
    window.open(`${API}/sitemap.xml`, '_blank');
  };

  return (
    <div className="space-x-4">
      <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700" onClick={handleGenerate}>Generate Sitemap</button>
      <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700" onClick={handleDownload}>View Sitemap</button>
    </div>
  );
}
