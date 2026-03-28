import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FolderKanban, FileText, CheckSquare, Settings, TrendingUp, BookUser, Package, Calendar, MessageSquare, FolderOpen, BarChart3 } from "lucide-react";
import cornxLogo from "@/assets/cornx-logo.png";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/clients", label: "Clients", icon: Users },
  { path: "/contacts", label: "Contacts", icon: BookUser },
  { path: "/pipeline", label: "Pipeline", icon: TrendingUp },
  { path: "/projects", label: "Projects", icon: FolderKanban },
  { path: "/tasks", label: "Tasks", icon: CheckSquare },
  { path: "/invoices", label: "Invoices", icon: FileText },
  { path: "/communications", label: "Comms", icon: MessageSquare },
  { path: "/meetings", label: "Meetings", icon: Calendar },
  { path: "/documents", label: "Documents", icon: FolderOpen },
  { path: "/services", label: "Services", icon: Package },
  { path: "/reports", label: "Reports", icon: BarChart3 },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <img src={cornxLogo} alt="Cornx" width={28} height={28} />
        <span className="font-display text-lg font-bold gold-text">Cornx.app</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
