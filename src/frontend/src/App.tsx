import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import {
  AlertTriangle,
  Building2,
  ShieldAlert,
  Trash2,
  Wind,
} from "lucide-react";
import { Suspense, lazy, useState } from "react";
import { createActor } from "./backend";
import { Layout } from "./components/Layout";
import { useAuth } from "./hooks/use-auth";

const HomePage = lazy(() => import("./pages/Home"));
const ReportsPage = lazy(() => import("./pages/Reports"));
const LeaderboardPage = lazy(() => import("./pages/Leaderboard"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const MessagesPage = lazy(() => import("./pages/Messages"));

const PageLoader = () => (
  <div className="flex flex-col gap-4 p-6">
    <Skeleton className="h-8 w-48 rounded" />
    <Skeleton className="h-36 w-full rounded-lg" />
    <Skeleton className="h-36 w-full rounded-lg" />
  </div>
);

// ─── Auth Guard ──────────────────────────────────────────────────────────────

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const {
    isLoggedIn,
    isInitializing,
    login,
    needsRegistration,
    refetchProfile,
  } = useAuth();
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!username.trim() || !actor) return;
    setRegistering(true);
    setError("");
    try {
      await actor.registerProfile(username.trim());
      await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      await refetchProfile();
    } catch {
      setError("Failed to register. Try a different username.");
    } finally {
      setRegistering(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <Building2
            className="w-10 h-10 animate-pulse"
            style={{ color: "oklch(var(--accent))" }}
          />
          <p className="font-mono text-sm text-muted-foreground tracking-widest uppercase">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LandingPage onLogin={login} />;
  }

  if (needsRegistration) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-4">
        <div
          className="w-full max-w-sm rounded-xl p-8 flex flex-col gap-6"
          style={{
            background: "oklch(var(--card))",
            border: "2px solid oklch(var(--primary))",
          }}
          data-ocid="register.dialog"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <Building2
              className="w-10 h-10"
              style={{ color: "oklch(var(--accent))" }}
            />
            <h1 className="font-display text-xl font-bold tracking-wide uppercase">
              Choose Your Handle
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              Pick a username to start reporting issues in your city.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Input
              placeholder="e.g. civic_hawk_99"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              className="font-mono border-2"
              style={{ borderColor: "oklch(var(--primary))" }}
              data-ocid="register.username_input"
            />
            {error && (
              <p
                className="text-xs text-destructive font-mono"
                data-ocid="register.error_state"
              >
                {error}
              </p>
            )}
            <Button
              onClick={handleRegister}
              disabled={!username.trim() || registering}
              className="w-full font-display font-bold uppercase tracking-widest"
              style={{
                background: "oklch(var(--accent))",
                color: "oklch(var(--accent-foreground))",
              }}
              data-ocid="register.submit_button"
            >
              {registering ? "Registering…" : "Enter CleanZone"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

function LandingPage({ onLogin }: { onLogin: () => void }) {
  const features = [
    {
      icon: Trash2,
      label: "Report Garbage",
      desc: "Flag dumping sites and littering zones",
    },
    {
      icon: Wind,
      label: "Track Pollution",
      desc: "Identify pollution hotspots in your city",
    },
    {
      icon: ShieldAlert,
      label: "Mark Unsafe Areas",
      desc: "Alert neighbors to dangerous conditions",
    },
    {
      icon: AlertTriangle,
      label: "Earn Badges",
      desc: "Get recognized for civic contributions",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <div
        className="flex flex-col items-center justify-center flex-1 text-center px-6 py-16 gap-8"
        style={{
          background:
            "linear-gradient(160deg, oklch(var(--card)) 0%, oklch(var(--background)) 60%)",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-20 h-20 flex items-center justify-center rounded-2xl"
            style={{
              border: "2px solid oklch(var(--primary))",
              background: "oklch(var(--card))",
            }}
          >
            <Building2
              className="w-10 h-10"
              style={{ color: "oklch(var(--accent))" }}
              strokeWidth={2}
            />
          </div>
          <div>
            <h1 className="font-display font-bold text-4xl tracking-widest uppercase text-foreground">
              Clean<span style={{ color: "oklch(var(--accent))" }}>Zone</span>
            </h1>
            <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mt-1">
              Civic Infrastructure · Community Reports
            </p>
          </div>
        </div>

        <p className="font-body text-base text-muted-foreground max-w-xs leading-relaxed">
          Report garbage, pollution, and unsafe areas. Help build cleaner, safer
          cities — one report at a time.
        </p>

        <Button
          onClick={onLogin}
          size="lg"
          className="px-10 py-6 font-display font-bold tracking-widest uppercase text-base rounded-lg"
          style={{
            background: "oklch(var(--accent))",
            color: "oklch(var(--accent-foreground))",
            border: "none",
          }}
          data-ocid="landing.login_button"
        >
          Get Started
        </Button>
      </div>

      {/* Feature grid */}
      <div
        className="px-4 pb-12 pt-6 grid grid-cols-2 gap-3 max-w-lg mx-auto w-full"
        style={{ borderTop: "2px solid oklch(var(--border))" }}
      >
        {features.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex flex-col gap-2 p-4 rounded-lg"
            style={{
              background: "oklch(var(--card))",
              border: "2px solid oklch(var(--border))",
            }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: "oklch(var(--accent))" }}
              strokeWidth={2}
            />
            <p className="font-display font-semibold text-sm text-foreground">
              {label}
            </p>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <AuthWrapper>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </Layout>
    </AuthWrapper>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: ReportsPage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages",
  component: MessagesPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  reportsRoute,
  leaderboardRoute,
  profileRoute,
  messagesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
