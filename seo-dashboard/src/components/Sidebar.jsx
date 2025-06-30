<<<<<<< HEAD

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  Map,
  Network,
  GaugeCircle,
  Bot,
  Tags,
} from "lucide-react"; // 🆕 Import Tags icon for Meta Tags

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Open Graph", to: "/open-graph", icon: Code2 },
  { label: "Structured Data", to: "/structured-data", icon: Network },
  { label: "Sitemap", to: "/sitemap", icon: Map },
  { label: "Performance", to: "/performance", icon: GaugeCircle },
  { label: "Robots.txt", to: "/robots", icon: Bot },
  { label: "Meta Tags", to: "/meta-tags", icon: Tags }, // ✅ Added Meta Tags module
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow h-screen sticky top-0">
      <div className="p-4 text-xl font-bold border-b">SEO Dashboard</div>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
=======

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  Map,
  Network,
  GaugeCircle,
  Bot,
  Tags,
} from "lucide-react"; // 🆕 Import Tags icon for Meta Tags

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Open Graph", to: "/open-graph", icon: Code2 },
  { label: "Structured Data", to: "/structured-data", icon: Network },
  { label: "Sitemap", to: "/sitemap", icon: Map },
  { label: "Performance", to: "/performance", icon: GaugeCircle },
  { label: "Robots.txt", to: "/robots", icon: Bot },
  { label: "Meta Tags", to: "/meta-tags", icon: Tags }, // ✅ Added Meta Tags module
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow h-screen sticky top-0">
      <div className="p-4 text-xl font-bold border-b">SEO Dashboard</div>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
>>>>>>> 6f38cf4 (Update frontend with latest changes)
