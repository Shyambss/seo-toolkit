<<<<<<< HEAD
// src/modules/structuredData/StructuredDataDashboard.jsx
import React, { useState } from 'react';
import CountsOverview from './CountsOverview';
import ViewData from './ViewData';
import BlogForm from './forms/BlogForm';
import FaqForm from './forms/FaqForm';
import EventForm from './forms/EventForm';
import TestimonialForm from './forms/TestimonialForm';

const StructuredDataDashboard = () => {
  const [selectedType, setSelectedType] = useState('blog');
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'blog':
        return <BlogForm onDataChange={triggerRefresh} />;
      case 'faq':
        return <FaqForm onDataChange={triggerRefresh} />;
      case 'event':
        return <EventForm onDataChange={triggerRefresh} />;
      case 'testimonial':
        return <TestimonialForm onDataChange={triggerRefresh} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Structured Data Module</h1>

      {/* Type Selector */}
      <div className="flex items-center gap-4">
        <label className="font-semibold">Select Type:</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="blog">Blog</option>
          <option value="faq">FAQ</option>
          <option value="event">Event</option>
          <option value="testimonial">Testimonial</option>
        </select>
      </div>

      {/* Dynamic Form based on type */}
      {renderForm()}

      {/* Overview and Data View (Refresh both on change) */}
      <CountsOverview key={refreshKey} />
      <ViewData refresh={refreshKey} />
    </div>
  );
};

export default StructuredDataDashboard;
=======
// src/modules/structuredData/StructuredDataDashboard.jsx
import React, { useState } from 'react';
import CountsOverview from './CountsOverview';
import ViewData from './ViewData';
import BlogForm from './forms/BlogForm';
import FaqForm from './forms/FaqForm';
import EventForm from './forms/EventForm';
import TestimonialForm from './forms/TestimonialForm';

const StructuredDataDashboard = () => {
  const [selectedType, setSelectedType] = useState('blog');
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'blog':
        return <BlogForm onDataChange={triggerRefresh} />;
      case 'faq':
        return <FaqForm onDataChange={triggerRefresh} />;
      case 'event':
        return <EventForm onDataChange={triggerRefresh} />;
      case 'testimonial':
        return <TestimonialForm onDataChange={triggerRefresh} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Structured Data Module</h1>

      {/* Type Selector */}
      <div className="flex items-center gap-4">
        <label className="font-semibold">Select Type:</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="blog">Blog</option>
          <option value="faq">FAQ</option>
          <option value="event">Event</option>
          <option value="testimonial">Testimonial</option>
        </select>
      </div>

      {/* Dynamic Form based on type */}
      {renderForm()}

      {/* Overview and Data View (Refresh both on change) */}
      <CountsOverview key={refreshKey} />
      <ViewData refresh={refreshKey} />
    </div>
  );
};

export default StructuredDataDashboard;
>>>>>>> 6f38cf4 (Update frontend with latest changes)
