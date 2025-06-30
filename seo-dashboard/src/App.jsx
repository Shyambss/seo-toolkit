import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import OpenGraph from "./modules/OpenGraph/OpenGraphPage";
import SitemapDashboard from './modules/Sitemap/SitemapDashboard';
import StructuredDataDashboard from './modules/structuredData/StructuredDataDashboard';
import Performance from "./modules/Performance/Performance";
import RobotsPage from "./modules/robots/RobotsPage";
import MetaTagsPage from "./modules/MetaTags/MetaTagsPage";

export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/open-graph" element={<OpenGraph />} />
            <Route path="/structured-data" element={<StructuredDataDashboard />} />
            <Route path="/sitemap" element={<SitemapDashboard />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/robots" element={<RobotsPage />} />
            <Route path="/meta-tags" element={<MetaTagsPage />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
