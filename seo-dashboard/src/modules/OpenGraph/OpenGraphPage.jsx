import { useState } from "react";
import OgForm from "./OgForm";
import OgList from "./OgList";
import OgPreview from "./OgPreview";
import { createOgTag, updateOgTag } from "./api";

const OpenGraphPage = () => {
  const [selectedTag, setSelectedTag] = useState(null);

  // Declare a function to reload the OG tags
  const [reload, setReload] = useState(false);

  const handleSubmit = async (data) => {
    if (selectedTag) {
      await updateOgTag(data);
      alert("OG Tag Updated");
    } else {
      await createOgTag(data);
      alert("OG Tag Added");
    }

    setSelectedTag(null);
    setReload((prev) => !prev);  // Toggle the reload state to trigger a re-fetch of the tags
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">📘 Open Graph Tags</h2>
      <OgForm onSubmit={handleSubmit} initialData={selectedTag} />
      <OgPreview data={selectedTag} />
      <OgList onEdit={setSelectedTag} reload={reload} />
    </div>
  );
};

export default OpenGraphPage;
