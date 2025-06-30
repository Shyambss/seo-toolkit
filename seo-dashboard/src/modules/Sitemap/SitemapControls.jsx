<<<<<<< HEAD
import axios from 'axios';

export default function SitemapControls() {
  const handleGenerate = async () => {
    await axios.get('http://localhost:5000/api/sitemap/generate-sitemap');
    alert('Sitemap generated successfully!');
  };

  const handleDownload = () => {
    window.open('http://localhost:5000/sitemap.xml', '_blank');
  };

  return (
    <div className="space-x-4">
      <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700" onClick={handleGenerate}>Generate Sitemap</button>
      <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700" onClick={handleDownload}>View Sitemap</button>
    </div>
  );
}
=======
import axios from 'axios';

export default function SitemapControls() {
  const handleGenerate = async () => {
    await axios.get('https://seo-toolkit-08ge.onrender.com/api/sitemap/generate-sitemap');
    alert('Sitemap generated successfully!');
  };

  const handleDownload = () => {
    window.open('https://seo-toolkit-08ge.onrender.com/sitemap.xml', '_blank');
  };

  return (
    <div className="space-x-4">
      <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700" onClick={handleGenerate}>Generate Sitemap</button>
      <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700" onClick={handleDownload}>View Sitemap</button>
    </div>
  );
}
>>>>>>> 6f38cf4 (Update frontend with latest changes)
