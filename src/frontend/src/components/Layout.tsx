import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { ChevronDown, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";
import { SideNav } from "./SideNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isLoggedIn, profile, logout } = useAuth();

  const initials = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : "CZ";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop side nav */}
      <SideNav />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Desktop header bar */}
        <div
          className="hidden md:flex items-center justify-between px-6 h-14 shrink-0"
          style={{
            background: "oklch(var(--card))",
            borderBottom: "2px solid oklch(var(--primary))",
          }}
        >
          <div />
          {isLoggedIn && profile && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 rounded-lg px-3 py-2 transition-smooth hover:bg-muted/50"
                data-ocid="desktop_header.user_menu"
              >
                <Avatar
                  className="w-7 h-7 border"
                  style={{ borderColor: "oklch(var(--primary))" }}
                >
                  <AvatarFallback
                    className="text-[10px] font-mono font-bold"
                    style={{
                      background: "oklch(var(--primary) / 0.15)",
                      color: "oklch(var(--primary))",
                    }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-body text-muted-foreground">
                  {profile.username}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                  onClick={logout}
                  data-ocid="desktop_header.logout_button"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 flex flex-col md:pb-0 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
