import MetaTagForm from './MetaTagForm';
import MetaTagList from './MetaTagList';
import MetaTagPreview from './MetaTagPreview';
import { useState, useEffect } from 'react';
import axios from 'axios';

const MetaTagsPage = () => {
  const [metaTags, setMetaTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  const fetchMetaTags = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/meta`);
    setMetaTags(res.data.metaTags);
  };

  useEffect(() => {
    fetchMetaTags();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Meta Tag Manager</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetaTagForm
          fetchMetaTags={fetchMetaTags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />
        <MetaTagPreview tag={selectedTag} />
      </div>
      <MetaTagList
        metaTags={metaTags}
        fetchMetaTags={fetchMetaTags}
        setSelectedTag={setSelectedTag}
      />
    </div>
  );
};

export default MetaTagsPage;
