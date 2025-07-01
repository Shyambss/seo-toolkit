// src/modules/structuredData/StructuredDataCount.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StructuredDataCount = ({ type }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/structured-data/${type}/count`)
      .then((res) => setCount(res.data.count))
      .catch((err) => console.error(err));
  }, [type]);

  return <p className="text-sm text-gray-600">🔢 Total {type} entries: {count}</p>;
};

export default StructuredDataCount;
