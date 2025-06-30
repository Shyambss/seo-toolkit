<<<<<<< HEAD
import React from 'react';

const RuleForm = ({ index, rule, onChange, onRemove }) => {
  const updateField = (field, value) => {
    onChange({ ...rule, [field]: value });
  };

  const updateListField = (field, value, i) => {
    const list = [...(rule[field] || [])];
    list[i] = value;
    onChange({ ...rule, [field]: list });
  };

  const addToList = (field) => {
    const list = [...(rule[field] || []), ''];
    onChange({ ...rule, [field]: list });
  };

  const removeFromList = (field, i) => {
    const list = [...(rule[field] || [])];
    list.splice(i, 1);
    onChange({ ...rule, [field]: list });
  };

  return (
    <div className="border p-4 rounded shadow bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">Rule #{index + 1}</h3>
        <button onClick={onRemove} className="text-red-600">Remove</button>
      </div>

      <label className="block mb-1 font-semibold">User-Agent</label>
      <input
        className="border p-2 w-full rounded mb-3"
        value={rule.userAgent}
        onChange={(e) => updateField('userAgent', e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-semibold">Allow</label>
          {(rule.allow || []).map((path, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="border p-1 w-full rounded"
                value={path}
                onChange={(e) => updateListField('allow', e.target.value, i)}
              />
              <button onClick={() => removeFromList('allow', i)}>✕</button>
            </div>
          ))}
          <button onClick={() => addToList('allow')} className="text-blue-600 text-sm">+ Add</button>
        </div>

        <div>
          <label className="font-semibold">Disallow</label>
          {(rule.disallow || []).map((path, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="border p-1 w-full rounded"
                value={path}
                onChange={(e) => updateListField('disallow', e.target.value, i)}
              />
              <button onClick={() => removeFromList('disallow', i)}>✕</button>
            </div>
          ))}
          <button onClick={() => addToList('disallow')} className="text-blue-600 text-sm">+ Add</button>
        </div>
      </div>

      <div className="mt-4">
        <label className="block font-semibold mb-1">Crawl-Delay (seconds)</label>
        <input
          type="number"
          className="border p-2 rounded w-full"
          value={rule.crawlDelay || ''}
          onChange={(e) => updateField('crawlDelay', Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default RuleForm;
=======
import React from 'react';

const RuleForm = ({ index, rule, onChange, onRemove }) => {
  const updateField = (field, value) => {
    onChange({ ...rule, [field]: value });
  };

  const updateListField = (field, value, i) => {
    const list = [...(rule[field] || [])];
    list[i] = value;
    onChange({ ...rule, [field]: list });
  };

  const addToList = (field) => {
    const list = [...(rule[field] || []), ''];
    onChange({ ...rule, [field]: list });
  };

  const removeFromList = (field, i) => {
    const list = [...(rule[field] || [])];
    list.splice(i, 1);
    onChange({ ...rule, [field]: list });
  };

  return (
    <div className="border p-4 rounded shadow bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">Rule #{index + 1}</h3>
        <button onClick={onRemove} className="text-red-600">Remove</button>
      </div>

      <label className="block mb-1 font-semibold">User-Agent</label>
      <input
        className="border p-2 w-full rounded mb-3"
        value={rule.userAgent}
        onChange={(e) => updateField('userAgent', e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-semibold">Allow</label>
          {(rule.allow || []).map((path, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="border p-1 w-full rounded"
                value={path}
                onChange={(e) => updateListField('allow', e.target.value, i)}
              />
              <button onClick={() => removeFromList('allow', i)}>✕</button>
            </div>
          ))}
          <button onClick={() => addToList('allow')} className="text-blue-600 text-sm">+ Add</button>
        </div>

        <div>
          <label className="font-semibold">Disallow</label>
          {(rule.disallow || []).map((path, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="border p-1 w-full rounded"
                value={path}
                onChange={(e) => updateListField('disallow', e.target.value, i)}
              />
              <button onClick={() => removeFromList('disallow', i)}>✕</button>
            </div>
          ))}
          <button onClick={() => addToList('disallow')} className="text-blue-600 text-sm">+ Add</button>
        </div>
      </div>

      <div className="mt-4">
        <label className="block font-semibold mb-1">Crawl-Delay (seconds)</label>
        <input
          type="number"
          className="border p-2 rounded w-full"
          value={rule.crawlDelay || ''}
          onChange={(e) => updateField('crawlDelay', Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default RuleForm;
>>>>>>> 6f38cf4 (Update frontend with latest changes)
