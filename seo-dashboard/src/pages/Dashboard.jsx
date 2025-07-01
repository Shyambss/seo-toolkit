import MetaTagsCard from '../components/cards/MetaTagsCard';
import OpenGraphCard from '../components/cards/OpenGraphCard';
import SitemapCard from '../components/cards/SitemapCard';
import PerformanceCard from '../components/cards/PerformanceCard';
import RobotsCard from '../components/cards/RobotsCard';
import StructuredCard from '../components/cards/StructuredCard';

const Dashboard = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetaTagsCard />
      <OpenGraphCard />
      <SitemapCard />
      <PerformanceCard />
      <RobotsCard />
      <StructuredCard />
    </div>
  );
};

export default Dashboard;
