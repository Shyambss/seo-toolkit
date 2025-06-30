import axios from 'axios';

const MetaTagList = ({ metaTags, fetchMetaTags, setSelectedTag }) => {
  const handleDelete = async (id) => {
    await axios.delete(`/api/meta/${id}`);
    fetchMetaTags();
  };

  return (
    <div className="mt-8 bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Saved Meta Tags</h3>
      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">URL</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {metaTags.map(tag => (
              <tr key={tag._id} className="hover:bg-gray-50 border-t">
                <td className="p-3 border">{tag.pageUrl}</td>
                <td className="p-3 border">{tag.title}</td>
                <td className="p-3 border space-x-2">
                  <button
                    onClick={() => setSelectedTag(tag)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tag._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {metaTags.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-4">No meta tags found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetaTagList;
