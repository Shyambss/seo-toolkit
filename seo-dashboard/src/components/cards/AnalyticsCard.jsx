// src/components/cards/AnalyticsCard.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchGaReport } from '../../api/analyticsApi' // Updated import

const AnalyticsCard = () => {
  const [data, setData] = useState({
    totalViews: 0,
    sessions: 0,
    newUsers: 0,
    topPage: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        // Use the new API function
        const res = await fetchGaReport()
        const report = res.report || [] // Adjust to `res.report` based on your backend structure

        let totalViews = 0
        let totalSessions = 0
        let totalNewUsers = 0
        let topPage = { path: '', views: 0 }

        report.forEach(item => {
          const views = item.screenPageViews || 0
          const sessions = item.sessions || 0
          const newUsers = item.newUsers || 0
          const path = item.pagePath || ''

          totalViews += views
          totalSessions += sessions
          totalNewUsers += newUsers

          if (views > topPage.views) {
            topPage = { path, views }
          }
        })

        setData({ totalViews, sessions: totalSessions, newUsers: totalNewUsers, topPage })
        setError(null)
      } catch (err) {
        console.error('Error loading GA data:', err)
        setError('Analytics data not available. Ensure GA4 Property ID is set and authorized.') // More specific error
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-2">Google Analytics</h3>

      {loading && <p className="text-sm text-gray-600">Loading data...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <p className="text-2xl font-bold text-blue-600">{data.totalViews} Views</p>
          <div className="text-sm text-gray-700 mt-1">
            <p>New Users: <span className="font-medium">{data.newUsers}</span></p>
            <p>Sessions: <span className="font-medium">{data.sessions}</span></p>
            {data.topPage?.path && (
              <p>
                Top Page:{' '}
                <span className="font-medium">{data.topPage.path}</span> ({data.topPage.views} views)
              </p>
            )}
          </div>
          <div className="mt-3">
            <Link to="/analytics" className="text-blue-500 hover:underline text-sm font-medium">
              View Module →
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default AnalyticsCard