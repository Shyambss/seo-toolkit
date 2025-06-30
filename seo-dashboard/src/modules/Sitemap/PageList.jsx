<<<<<<< HEAD
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PageList() {
  const [pages, setPages] = useState([]);

  const fetchPages = async () => {
    const res = await axios.get('http://localhost:5000/api/sitemap/get-pages');
    setPages(res.data);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this page?')) return;
    await axios.delete(`http://localhost:5000/api/sitemap/delete-page/${id}`);
    fetchPages();
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Stored Pages</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr>
            <th>URL</th>
            <th>Type</th>
            <th>Priority</th>
            <th>ChangeFreq</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page._id}>
              <td>{page.url}</td>
              <td>{page.pageType}</td>
              <td>{page.priority}</td>
              <td>{page.changeFreq}</td>
              <td><button className="text-red-500 bg-white-600 px-4 py-1 rounded hover:bg-blue-700" onClick={() => handleDelete(page._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
=======
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PageList() {
  const [pages, setPages] = useState([]);

  const fetchPages = async () => {
    const res = await axios.get('https://seo-toolkit-08ge.onrender.com/api/sitemap/get-pages');
    setPages(res.data);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this page?')) return;
    await axios.delete(`https://seo-toolkit-08ge.onrender.com/api/sitemap/delete-page/${id}`);
    fetchPages();
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Stored Pages</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr>
            <th>URL</th>
            <th>Type</th>
            <th>Priority</th>
            <th>ChangeFreq</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page._id}>
              <td>{page.url}</td>
              <td>{page.pageType}</td>
              <td>{page.priority}</td>
              <td>{page.changeFreq}</td>
              <td><button className="text-red-500 bg-white-600 px-4 py-1 rounded hover:bg-blue-700" onClick={() => handleDelete(page._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
>>>>>>> 6f38cf4 (Update frontend with latest changes)
