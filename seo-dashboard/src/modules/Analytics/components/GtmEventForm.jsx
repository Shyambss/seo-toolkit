// src/modules/Analytics/components/GtmEventForm.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Import toast

const GtmEventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    eventName: '',
    category: '',
    label: '',
    triggerType: 'click', // Default
    selector: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        eventName: event.eventName || '',
        category: event.category || '',
        label: event.label || '',
        triggerType: event.triggerType || 'click',
        selector: event.selector || '',
        // gtmTagId and gtmTriggerId are not form fields, but will be part of 'event'
        // when editing. They are not directly modified by the form.
      });
    } else {
      setFormData({
        name: '',
        eventName: '',
        category: '',
        label: '',
        triggerType: 'click',
        selector: '',
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.eventName || !formData.selector) {
      toast.warn('Please fill in all required fields: Name, GA4 Event Name, and CSS Selector.', { autoClose: 3000 });
      return;
    }
    onSubmit(formData); // This line is already correct.
  };

  return (
    <div className="mt-8 p-8 bg-gray-50 rounded-2xl shadow-inner border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-200">{event ? 'Edit GTM Event' : 'Create New GTM Event'}</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
            Internal Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Homepage CTA Click"
            required
            className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label htmlFor="eventName" className="block text-gray-700 text-sm font-semibold mb-2">
            GA4 Event Name:
          </label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="e.g., cta_button_click (snake_case)"
            required
            className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-gray-700 text-sm font-semibold mb-2">
            Category (Optional):
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Engagement"
            className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label htmlFor="label" className="block text-gray-700 text-sm font-semibold mb-2">
            Label (Optional):
          </label>
          <input
            type="text"
            id="label"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="e.g., Main CTA"
            className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label htmlFor="triggerType" className="block text-gray-700 text-sm font-semibold mb-2">
            Trigger Type:
          </label>
          <select
            id="triggerType"
            name="triggerType"
            value={formData.triggerType}
            onChange={handleChange}
            className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="click">Click</option>
            <option value="page_view">Page View</option>
            <option value="form_submission">Form Submission</option>
          </select>
        </div>
        <div>
          <label htmlFor="selector" className="block text-gray-700 text-sm font-semibold mb-2">
            CSS Selector:
          </label>
          <input
            type="text"
            id="selector"
            name="selector"
            value={formData.selector}
            onChange={handleChange}
            placeholder="e.g., .main-cta-button, #contact-form"
            required
            className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="flex items-center justify-end col-span-full mt-4 gap-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {event ? 'Update Event' : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2.5 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GtmEventForm;