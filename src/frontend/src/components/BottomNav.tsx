import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  FileText,
  Home,
  MapPin,
  MessageSquare,
  Trophy,
  User,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/leaderboard", label: "Leaders", icon: Trophy },
  { path: "/messages", label: "Messages", icon: MessageSquare },
  { path: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: "oklch(var(--card))",
        borderTop: "2px solid oklch(var(--primary))",
      }}
      data-ocid="bottom_nav"
    >
      <div className="flex items-center justify-around h-16 px-2">
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
                "relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-smooth min-w-0",
                isActive
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground",
              )}
              data-ocid={`bottom_nav.${label.toLowerCase()}_link`}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0",
                  isActive && "drop-shadow-[0_0_4px_oklch(var(--accent))]",
                )}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span
                className={cn(
                  "text-[10px] font-mono tracking-wide truncate",
                  isActive ? "font-semibold" : "font-normal",
                )}
              >
                {label}
              </span>
              {isActive && (
                <span
                  className="absolute bottom-0 w-10 h-0.5 rounded-t-sm"
                  style={{ background: "oklch(var(--accent))" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
