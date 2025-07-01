import { useState, useEffect } from 'react';
import axios from 'axios';

const MetaTagForm = ({ fetchMetaTags, selectedTag, setSelectedTag }) => {
  const [formData, setFormData] = useState({
    pageUrl: '',
    title: '',
    description: '',
    content: '',
    keywords: []
  });

  // Update formData when selectedTag changes
  useEffect(() => {
    if (selectedTag) {
      setFormData({ ...selectedTag, content: '' }); // Set data for editing, reset content field
    }
  }, [selectedTag]);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Generate keywords based on title, description, and content
  const handleGenerate = async () => {
    const { title, description, content } = formData;
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/meta/generate-keywords`, { title, description, content });
    setFormData(prev => ({ ...prev, keywords: res.data.keywords }));
  };

  // Handle form submission (Add or Update meta tag)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedTag?._id) {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/meta/${selectedTag._id}`, formData); // Update existing tag
    } else {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/meta`, formData); // Add new tag
    }

    fetchMetaTags();
    setFormData({ pageUrl: '', title: '', description: '', content: '', keywords: [] });
    setSelectedTag(null); // Reset selected tag
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <input
        name="pageUrl"
        value={formData.pageUrl}
        onChange={handleChange}
        placeholder="Page URL"
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Page Content (for keyword generation)"
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Generate Keywords
        </button>

        {/* Editable keyword input */}
        {formData.keywords.length > 0 && (
          <div>
            <label className="text-sm text-gray-600">Keywords (Editable):</label>
            <input
              type="text"
              value={formData.keywords.join(', ')}
              onChange={(e) => {
                const updatedKeywords = e.target.value.split(',').map(k => k.trim());
                setFormData(prev => ({ ...prev, keywords: updatedKeywords }));
              }}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        {selectedTag ? 'Update Meta Tag' : 'Add Meta Tag'}
      </button>
    </form>
  );
};

export default MetaTagForm;
