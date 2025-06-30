// src/modules/OpenGraph/OgForm.jsx
import { useState, useEffect } from "react";

const OgForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    page_url: "",
    og_title: "",
    og_description: "",
    og_image: "",
    og_type: "website",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      page_url: "",
      og_title: "",
      og_description: "",
      og_image: "",
      og_type: "website",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      {["page_url", "og_title", "og_description", "og_image", "og_type"].map((field) => (
        <div key={field}>
          <label className="block font-medium capitalize">{field.replace("_", " ")}</label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={initialData && field === "page_url"}
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {initialData ? "Update" : "Add"} OG Tag
      </button>
    </form>
  );
};

export default OgForm;
