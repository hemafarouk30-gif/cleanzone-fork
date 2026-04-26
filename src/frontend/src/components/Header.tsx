import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { Building2, ChevronDown, LogOut } from "lucide-react";

export function Header() {
  const { isLoggedIn, profile, logout } = useAuth();

  const initials = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : "CZ";

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 md:hidden"
      style={{
        background: "oklch(var(--card))",
        borderBottom: "2px solid oklch(var(--primary))",
      }}
      data-ocid="header"
    >
      {/* Brand */}
      <div className="flex items-center gap-2">
        <Building2
          className="w-5 h-5"
          style={{ color: "oklch(var(--accent))" }}
          strokeWidth={2}
        />
        <span className="font-display font-bold text-base tracking-widest uppercase">
          Clean<span style={{ color: "oklch(var(--accent))" }}>Zone</span>
        </span>
      </div>

      {/* Right side */}
      {isLoggedIn && profile && (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-smooth hover:bg-muted/50"
            data-ocid="header.user_menu"
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
            <span className="text-xs font-body text-muted-foreground max-w-[80px] truncate">
              {profile.username}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive gap-2 cursor-pointer"
              onClick={logout}
              data-ocid="header.logout_button"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
