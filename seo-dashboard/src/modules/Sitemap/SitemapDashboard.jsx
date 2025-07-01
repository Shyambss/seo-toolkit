import AddPageForm from './AddPageForm';
import PageList from './PageList';
import SitemapControls from './SitemapControls';
import CrawlerControls from './CrawlerControls';

export default function SitemapDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">XML Sitemap Manager</h1>
      <AddPageForm />
      <SitemapControls />
      <CrawlerControls />
      <PageList />
    </div>
  );
}
