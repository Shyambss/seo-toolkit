const PerformanceResults = ({ result }) => {
  if (!result) return null;

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-lg font-semibold mb-4">Analysis Result</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><strong>URL:</strong> {result.url}</div>
        <div><strong>Date:</strong> {new Date(result.date).toLocaleString()}</div>
        <div><strong>Performance Score:</strong> {result.performance_score}</div>
        <div><strong>LCP:</strong> {result.lcp} ms</div>
        <div><strong>CLS:</strong> {result.cls}</div>
        <div><strong>TTFB:</strong> {result.ttfb} ms</div>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold text-sm mb-2">Suggestions:</h3>
        <details className="mt-2">
          <summary className="text-blue-600 cursor-pointer">View Suggestions</summary>
          <pre className="bg-gray-100 p-2 mt-1 rounded whitespace-pre-wrap">
            {result.suggestions}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default PerformanceResults;
