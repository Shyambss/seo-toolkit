import React, { useEffect, useState } from 'react';
import axios from 'axios';

const types = ['blog', 'faq', 'event', 'testimonial'];

const CountsOverview = () => {
  const [counts, setCounts] = useState({});

  const fetchCounts = async () => {
    const data = {};
    for (let type of types) {
      try {
        const res = await axios.get(`/api/structured-data/${type}/count`);
        data[type] = res.data.count; // ✅ fixed line
      } catch (err) {
        console.error(`Error fetching count for ${type}:`, err);
        data[type] = 'Error';
      }
    }
    setCounts(data);
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      {types.map((type) => (
        <div key={type} className="bg-blue-100 p-4 rounded shadow">
          <h3 className="font-bold capitalize">{type}</h3>
          <p className="text-xl">{counts[type]}</p>
        </div>
      ))}
    </div>
  );
};

export default CountsOverview;
