import React, { useEffect, useState } from 'react';
import { getRobotsConfig, updateRobotsConfig } from './robotsAPI';
import RuleForm from './RuleForm';
import RobotsPreview from './RobotsPreview';

const RobotsPage = () => {
  const [rules, setRules] = useState([]);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const { data } = await getRobotsConfig();
    setRules(data.rules || []);
    setSitemapUrl(data.sitemapUrl || '');
  };

  const handleRuleChange = (index, updatedRule) => {
    const updatedRules = [...rules];
    updatedRules[index] = updatedRule;
    setRules(updatedRules);
  };

  const addNewRule = () => {
    setRules([...rules, { userAgent: '*', allow: [], disallow: [], crawlDelay: 1 }]);
  };

  const removeRule = (index) => {
    const updated = [...rules];
    updated.splice(index, 1);
    setRules(updated);
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      await updateRobotsConfig({ rules, sitemapUrl });
      alert('robots.txt updated!');
    } catch (err) {
      console.error(err);
      alert('Error updating');
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">robots.txt Configuration</h1>

      <div className="space-y-6">
        {rules.map((rule, idx) => (
          <RuleForm
            key={idx}
            index={idx}
            rule={rule}
            onChange={(r) => handleRuleChange(idx, r)}
            onRemove={() => removeRule(idx)}
          />
        ))}

        <button
          onClick={addNewRule}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add User-Agent Rule
        </button>

        <div>
          <label className="block font-semibold mb-1">Sitemap URL</label>
          <input
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="https://example.com/sitemap.xml"
          />
        </div>

        <button
          onClick={saveConfig}
          className="px-6 py-2 bg-green-600 text-white rounded mt-4"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Configuration'}
        </button>

        <RobotsPreview rules={rules} sitemapUrl={sitemapUrl} />
      </div>
    </div>
  );
};

export default RobotsPage;
