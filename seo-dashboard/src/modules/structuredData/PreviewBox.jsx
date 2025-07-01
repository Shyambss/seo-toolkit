// src/modules/structuredData/PreviewBox.jsx
import React from 'react';

const PreviewBox = ({ jsonLD }) => {
  return (
    <div className="mt-4">
      <h3 className="font-semibold">Live JSON-LD Preview:</h3>
      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
        {jsonLD}
      </pre>
    </div>
  );
};

export default PreviewBox;
