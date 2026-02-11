import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Phone,
  FileText,
  Users,
  Send,
  MessageSquare,
  BarChart3,
  Settings,
  MessageCircle,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Contas WhatsApp", href: "/accounts", icon: Phone },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Listas", href: "/lists", icon: Users },
  { name: "Campanhas", href: "/campaigns", icon: Send },

  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <div className="w-60 bg-card border-r border-border flex flex-col h-screen shrink-0">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold text-foreground">ZapFlow</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">WhatsApp Business SaaS</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Settings className="w-5 h-5" />
          Configurações
        </Link>
      </div>
    </div>
  );
}
