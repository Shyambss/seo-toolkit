const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// Import Routes
const ogRoutes = require("./routes/ogRoutes");
const structuredDataRoutes = require("./routes/structuredDataRoutes");
const sitemapRoutes = require("./routes/sitemapRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const robotsRoutes = require("./routes/robotsRoutes");
const metaTagRouter = require("./routes/metaTagRoutes");
const analyticsRoutes = require('./routes/analyticsRoutes'); // Assuming this handles your OAuth callback
const eventTrackingRoutes = require('./routes/eventTrackingRoutes');

// Import Schedulers (Ensure these files exist in your project)
const { startTrackingScheduler } = require('./services/trackerScheduler');
const { startSitemapScheduler } = require('./services/sitemapScheduler');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend's origin
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Serve static files (e.g., for sitemap.xml)
app.use(express.static(path.join(__dirname, "public")));

// Mount API Routes
app.use("/api/og-tags", ogRoutes);
app.use("/api/structured-data", structuredDataRoutes);
app.use("/api/sitemap", sitemapRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/robots", robotsRoutes);
app.use("/api/meta", metaTagRouter);
app.use('/api/analytics', analyticsRoutes); // Your analytics routes for OAuth
app.use('/api/gtm/events', eventTrackingRoutes);

// Schedule jobs (Ensure these functions are correctly implemented in their respective files)
startTrackingScheduler();
startSitemapScheduler();

// Serve sitemap.xml directly from the public folder
app.get("/sitemap.xml", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "sitemap.xml"));
});

// Basic route for health check
app.get('/', (req, res) => {
  res.send('SEO Toolkit API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});