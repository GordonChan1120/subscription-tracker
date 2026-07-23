import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Inbox,
  Settings,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/email-import", label: "Email Import", icon: Inbox },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 flex w-64 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-2 px-6 py-5">
        <CreditCard className="text-indigo-600" size={24} />
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">SubTracker</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              }`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        <p className="text-xs text-gray-400 dark:text-gray-500">Subscription Tracker</p>
      </div>
    </aside>
  );
}
