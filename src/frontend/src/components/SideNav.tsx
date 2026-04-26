import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Building2,
  FileText,
  Home,
  MessageSquare,
  Trophy,
  User,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { path: "/messages", label: "Messages", icon: MessageSquare },
  { path: "/profile", label: "Profile", icon: User },
];

export function SideNav() {
  const location = useLocation();

  return (
    <aside
      className="hidden md:flex flex-col w-60 min-h-screen shrink-0"
      style={{
        background: "oklch(var(--card))",
        borderRight: "2px solid oklch(var(--primary))",
      }}
      data-ocid="side_nav"
    >
      {/* Brand */}
      <div
        className="flex items-center gap-3 px-5 py-5 border-b"
        style={{ borderColor: "oklch(var(--border))" }}
      >
        <Building2
          className="w-7 h-7 shrink-0"
          style={{ color: "oklch(var(--accent))" }}
          strokeWidth={2}
        />
        <div>
          <span className="font-display font-bold text-lg tracking-widest uppercase text-foreground">
            Clean<span style={{ color: "oklch(var(--accent))" }}>Zone</span>
          </span>
          <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
            Civic Reports
          </p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive =
            path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body transition-smooth group",
                isActive
                  ? "text-accent font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
              style={
                isActive
                  ? {
                      background: "oklch(var(--accent) / 0.1)",
                      borderLeft: "3px solid oklch(var(--accent))",
                    }
                  : {}
              }
              data-ocid={`side_nav.${label.toLowerCase().replace(" ", "_")}_link`}
            >
              <Icon
                className="w-4.5 h-4.5 shrink-0"
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: "oklch(var(--border))" }}
      >
        <p className="text-[10px] font-mono text-muted-foreground">
          © {new Date().getFullYear()} CleanZone
        </p>
      </div>
    </aside>
  );
}
