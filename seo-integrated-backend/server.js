const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

// Import Routes
const ogRoutes = require("./routes/ogRoutes");
const structuredDataRoutes = require("./routes/structuredDataRoutes");
const sitemapRoutes = require("./routes/sitemapRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const robotsRoutes = require("./routes/robotsRoutes");
const metaTagRouter = require("./routes/metaTagRoutes");
const { startTrackingScheduler } = require('./services/trackerScheduler');
const { startSitemapScheduler } = require('./services/sitemapScheduler');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Allow cross-origin requests
app.use(express.json());  // Parse JSON request bodies

// Connect to MongoDB (Unified DB connection logic)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Static file serving (including robots.txt, sitemap.xml)
app.use(express.static(path.join(__dirname, "public")));

// Mount API Routes
app.use("/api/og-tags", ogRoutes);
app.use("/api/structured-data", structuredDataRoutes);
app.use("/api/sitemap", sitemapRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/robots", robotsRoutes);
app.use("/api/meta", metaTagRouter);

//for scheduled tracking 
startTrackingScheduler();
//for scheduled crawling
startSitemapScheduler();

// Serve sitemap.xml
app.get("/sitemap.xml", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "sitemap.xml"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
