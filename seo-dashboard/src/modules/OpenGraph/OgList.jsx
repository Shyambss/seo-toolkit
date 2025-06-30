import { useEffect, useState, useRef } from "react";
import { fetchAllOgTags, fetchOgTagByUrl, deleteOgTag } from "./api";

const OgList = ({ onEdit, reload }) => {
  const [tags, setTags] = useState([]);
  const [searchUrl, setSearchUrl] = useState("");
  const isInitialRender = useRef(true); // To prevent fetch on initial render

  const loadTags = async () => {
    const res = await fetchAllOgTags();
    setTags(res.data);
  };

  const handleSearch = async () => {
    if (!searchUrl) return loadTags();
    try {
      const res = await fetchOgTagByUrl(searchUrl);
      setTags([res.data]);
    } catch (e) {
      alert("Tag not found!");
    }
  };

  const handleDelete = async (page_url) => {
    if (window.confirm("Delete this tag?")) {
      await deleteOgTag(page_url);
      loadTags();
    }
  };

  // Fetch tags whenever reload changes
  useEffect(() => {
    if (!isInitialRender.current) {
      loadTags();
    } else {
      isInitialRender.current = false;
    }
  }, [reload]); // Dependency on `reload` prop

  useEffect(() => {
    loadTags();
  }, []); // Initial fetch of tags

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchUrl}
          onChange={(e) => setSearchUrl(e.target.value)}
          placeholder="Search by Page URL"
          className="border px-3 py-2 rounded w-full"
        />
        <button onClick={handleSearch} className="bg-gray-800 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">URL</th>
              <th>Title</th>
              <th>Description</th>
              <th>Image</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.page_url} className="border-t">
                <td className="p-2">{tag.page_url}</td>
                <td>{tag.og_title}</td>
                <td>{tag.og_description}</td>
                <td>
                  <img src={tag.og_image} alt="OG" className="w-20 h-12 object-cover" />
                </td>
                <td>{tag.og_type}</td>
                <td>
                  <button
                    onClick={() => onEdit(tag)}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tag.page_url)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OgList;
