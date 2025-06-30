<<<<<<< HEAD
// src/modules/structuredData/StructuredDataCount.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StructuredDataCount = ({ type }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios.get(`/api/structured-data/${type}/count`)
      .then((res) => setCount(res.data.count))
      .catch((err) => console.error(err));
  }, [type]);

  return <p className="text-sm text-gray-600">🔢 Total {type} entries: {count}</p>;
};

export default StructuredDataCount;
=======
// src/modules/structuredData/StructuredDataCount.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StructuredDataCount = ({ type }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios.get(`/api/structured-data/${type}/count`)
      .then((res) => setCount(res.data.count))
      .catch((err) => console.error(err));
  }, [type]);

  return <p className="text-sm text-gray-600">🔢 Total {type} entries: {count}</p>;
};

export default StructuredDataCount;
>>>>>>> 6f38cf4 (Update frontend with latest changes)
