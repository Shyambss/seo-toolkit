const MetaTagPreview = ({ tag }) => {
  if (!tag) {
    return (
      <div className="p-4 border rounded bg-white shadow text-gray-500">
        No preview available
      </div>
    );
  }

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h3 className="text-lg font-semibold mb-3">Meta Tag Preview</h3>
      <div className="space-y-1 text-sm">
        <p><span className="font-semibold">URL:</span> {tag.pageUrl}</p>
        <p><span className="font-semibold">Title:</span> {tag.title}</p>
        <p><span className="font-semibold">Description:</span> {tag.description}</p>
        <p><span className="font-semibold">Keywords:</span> {tag.keywords?.join(', ') || 'N/A'}</p>
      </div>
    </div>
  );
};

export default MetaTagPreview;
