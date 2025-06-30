// src/modules/OpenGraph/OgPreview.jsx
const OgPreview = ({ data }) => {
    if (!data?.page_url) return null;
  
    return (
      <div className="border p-4 rounded bg-white shadow">
        <p className="text-sm text-gray-600 mb-1">Live Preview:</p>
        <div className="border p-4 rounded-md space-y-2 bg-gray-50">
          <p className="text-blue-600 font-bold">{data.og_title}</p>
          <p className="text-gray-700">{data.og_description}</p>
          <img src={data.og_image} alt="OG Preview" className="w-32 h-20 object-cover" />
          <p className="text-sm text-gray-500">Type: {data.og_type}</p>
          <a href={data.page_url} className="text-blue-500 text-sm" target="_blank" rel="noreferrer">
            {data.page_url}
          </a>
        </div>
      </div>
    );
  };
  
  export default OgPreview;
  