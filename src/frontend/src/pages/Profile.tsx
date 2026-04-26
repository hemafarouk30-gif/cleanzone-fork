import { createActor } from "@/backend";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import type { ReportPublic } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  Check,
  Edit2,
  FileText,
  HardHat,
  Leaf,
  Lock,
  MapPin,
  Shield,
  Star,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BadgeId, ReportStatus } from "../backend.d";

// ─── Badge Metadata ────────────────────────────────────────────────────────────

const BADGE_META: Record<
  BadgeId,
  { label: string; desc: string; icon: React.ElementType; color: string }
> = {
  [BadgeId.pioneer]: {
    label: "Pioneer",
    desc: "One of the first to join CleanZone",
    icon: Shield,
    color: "oklch(0.62 0.2 258)",
  },
  [BadgeId.first_report]: {
    label: "First Report",
    desc: "Submitted your first report",
    icon: FileText,
    color: "oklch(0.7 0.22 44)",
  },
  [BadgeId.ten_reports]: {
    label: "10 Reports",
    desc: "Submitted 10 reports",
    icon: Star,
    color: "oklch(0.72 0.18 145)",
  },
  [BadgeId.fifty_reports]: {
    label: "50 Reports",
    desc: "Submitted 50 reports",
    icon: Zap,
    color: "oklch(0.65 0.2 30)",
  },
  [BadgeId.hundred_reports]: {
    label: "100 Reports",
    desc: "Submitted 100 reports",
    icon: Award,
    color: "oklch(0.82 0.18 85)",
  },
  [BadgeId.eco_warrior]: {
    label: "Eco Warrior",
    desc: "Completed the eco challenge",
    icon: Leaf,
    color: "oklch(0.58 0.2 145)",
  },
};

const ALL_BADGE_IDS: BadgeId[] = [
  BadgeId.first_report,
  BadgeId.ten_reports,
  BadgeId.fifty_reports,
  BadgeId.hundred_reports,
  BadgeId.pioneer,
  BadgeId.eco_warrior,
];

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<ReportStatus, string> = {
  [ReportStatus.pending]: "Pending",
  [ReportStatus.approved]: "Approved",
  [ReportStatus.resolved]: "Resolved",
};

const STATUS_STYLES: Record<
  ReportStatus,
  { bg: string; text: string; dot: string }
> = {
  [ReportStatus.pending]: {
    bg: "oklch(var(--muted))",
    text: "oklch(var(--muted-foreground))",
    dot: "oklch(0.65 0.1 60)",
  },
  [ReportStatus.approved]: {
    bg: "oklch(0.55 0.14 258 / 0.18)",
    text: "oklch(0.55 0.14 258)",
    dot: "oklch(0.55 0.14 258)",
  },
  [ReportStatus.resolved]: {
    bg: "oklch(0.55 0.16 145 / 0.18)",
    text: "oklch(0.55 0.16 145)",
    dot: "oklch(0.55 0.16 145)",
  },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center gap-1 p-4 rounded-xl flex-1"
      style={{
        background: accent
          ? "oklch(var(--accent) / 0.08)"
          : "oklch(var(--card))",
        border: accent
          ? "2px solid oklch(var(--accent) / 0.5)"
          : "2px solid oklch(var(--border))",
      }}
    >
      <span
        className="font-mono font-bold text-xl"
        style={{
          color: accent ? "oklch(var(--accent))" : "oklch(var(--foreground))",
        }}
      >
        {value}
      </span>
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest text-center">
        {label}
      </span>
    </div>
  );
}

function StatusPill({ status }: { status: ReportStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wide"
      style={{ background: s.bg, color: s.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: s.dot }}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}

function BadgeTile({ badgeId, earned }: { badgeId: BadgeId; earned: boolean }) {
  const meta = BADGE_META[badgeId];
  const Icon = meta.icon;

  if (!earned) {
    return (
      <div
        className="flex flex-col items-center gap-2 p-3 rounded-xl text-center opacity-40"
        style={{
          background: "oklch(var(--muted) / 0.3)",
          border: "2px dashed oklch(var(--border))",
        }}
        data-ocid={`profile.badge_locked.${badgeId}`}
      >
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted/50">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          {meta.label}
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center gap-2 p-3 rounded-xl text-center"
      style={{
        background: "oklch(var(--card))",
        border: `2px solid ${meta.color}33`,
        boxShadow: `0 0 8px ${meta.color}18`,
      }}
      title={meta.desc}
      data-ocid={`profile.badge.${badgeId}`}
    >
      <div
        className="w-9 h-9 flex items-center justify-center rounded-lg"
        style={{ background: `${meta.color}22` }}
      >
        <Icon className="w-5 h-5" style={{ color: meta.color }} />
      </div>
      <span
        className="text-[10px] font-mono font-semibold"
        style={{ color: meta.color }}
      >
        {meta.label}
      </span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

type StatusFilter = "all" | ReportStatus;

const FILTER_TABS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: ReportStatus.pending },
  { label: "Approved", value: ReportStatus.approved },
  { label: "Resolved", value: ReportStatus.resolved },
];

export default function Profile() {
  const { profile, refetchProfile } = useAuth();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data: myReports, isLoading: reportsLoading } = useQuery<
    ReportPublic[]
  >({
    queryKey: ["myReports", profile?.id],
    queryFn: async () => {
      if (!actor || !profile) return [];
      return actor.getReportsByUser(profile.id);
    },
    enabled: !!actor && !isFetching && !!profile,
  });

  const { data: myRank } = useQuery<bigint>({
    queryKey: ["myRank"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getMyRank();
    },
    enabled: !!actor && !isFetching && !!profile,
  });

  const updateUsernameMutation = useMutation({
    mutationFn: async (username: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerProfile(username);
    },
    onSuccess: async () => {
      toast.success("Username updated!");
      await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      await refetchProfile();
      setEditing(false);
    },
    onError: () => toast.error("Failed to update username."),
  });

  const startEdit = () => {
    setNewUsername(profile?.username ?? "");
    setEditing(true);
  };

  if (!profile) {
    return (
      <div
        className="flex flex-col gap-4 px-4 py-5 max-w-2xl mx-auto"
        data-ocid="profile.loading_state"
      >
        <Skeleton className="h-36 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  const joinedDate = new Date(
    Number(profile.joinedAt) / 1_000_000,
  ).toLocaleDateString("en-US", { year: "numeric", month: "short" });

  const rankDisplay = myRank ? `#${Number(myRank)}` : "—";

  const filteredReports =
    statusFilter === "all"
      ? (myReports ?? [])
      : (myReports ?? []).filter((r) => r.status === statusFilter);

  const earnedSet = new Set(profile.badges);

  return (
    <div
      className="flex flex-col gap-5 px-4 py-5 max-w-2xl mx-auto"
      data-ocid="profile.page"
    >
      {/* ─── Profile Header ─────────────────────────────────────────── */}
      <div
        className="flex flex-col gap-5 p-5 rounded-xl"
        style={{
          background: "oklch(var(--card))",
          border: "2px solid oklch(var(--primary))",
        }}
        data-ocid="profile.card"
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <Avatar
              className="w-16 h-16 border-2"
              style={{ borderColor: "oklch(var(--accent))" }}
            >
              <AvatarFallback
                className="text-xl font-mono font-bold"
                style={{
                  background: "oklch(var(--accent) / 0.15)",
                  color: "oklch(var(--accent))",
                }}
              >
                <HardHat className="w-7 h-7" />
              </AvatarFallback>
            </Avatar>
            {/* Rank badge on avatar */}
            {myRank && (
              <div
                className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-full font-mono font-bold text-[9px] leading-none"
                style={{
                  background: "oklch(var(--accent))",
                  color: "oklch(var(--accent-foreground))",
                  border: "1.5px solid oklch(var(--card))",
                }}
              >
                #{Number(myRank)}
              </div>
            )}
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      updateUsernameMutation.mutate(newUsername);
                    if (e.key === "Escape") setEditing(false);
                  }}
                  className="border-2 font-mono h-8 text-sm"
                  style={{ borderColor: "oklch(var(--primary))" }}
                  data-ocid="profile.username_input"
                  autoFocus
                  maxLength={24}
                />
                <Button
                  type="button"
                  size="icon"
                  className="w-8 h-8 shrink-0"
                  onClick={() => updateUsernameMutation.mutate(newUsername)}
                  disabled={
                    !newUsername.trim() || updateUsernameMutation.isPending
                  }
                  style={{ background: "oklch(var(--accent))", border: "none" }}
                  data-ocid="profile.save_button"
                >
                  <Check
                    className="w-4 h-4"
                    style={{ color: "oklch(var(--accent-foreground))" }}
                  />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="w-8 h-8 shrink-0 border-2"
                  onClick={() => setEditing(false)}
                  style={{ borderColor: "oklch(var(--border))" }}
                  data-ocid="profile.cancel_button"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg tracking-wide truncate">
                  {profile.username}
                </h1>
                <button
                  type="button"
                  onClick={startEdit}
                  className="p-1 rounded transition-smooth hover:bg-muted/50"
                  aria-label="Edit username"
                  data-ocid="profile.edit_button"
                >
                  <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-xs font-mono text-muted-foreground">
                Joined {joinedDate}
              </span>
              <span
                className="inline-flex items-center gap-1 text-xs font-mono font-semibold"
                style={{ color: "oklch(var(--accent))" }}
              >
                <Trophy className="w-3 h-3" />
                Rank {rankDisplay}
              </span>
            </div>
          </div>

          {/* Points — prominent */}
          <div
            className="flex flex-col items-center justify-center rounded-xl px-3 py-2 shrink-0"
            style={{
              background: "oklch(var(--accent) / 0.1)",
              border: "2px solid oklch(var(--accent) / 0.4)",
            }}
          >
            <span
              className="font-mono font-bold text-2xl leading-none"
              style={{ color: "oklch(var(--accent))" }}
            >
              {Number(profile.points).toLocaleString()}
            </span>
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">
              pts
            </span>
          </div>
        </div>

        {/* Contribution stats row */}
        <div className="flex gap-3" data-ocid="profile.stats">
          <StatCard label="Reports" value={Number(profile.reportCount)} />
          <StatCard label="Badges" value={profile.badges.length} />
          <StatCard label="Rank" value={rankDisplay} accent />
        </div>
      </div>

      {/* ─── Badges ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3" data-ocid="profile.badges_section">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-sm uppercase tracking-widest text-foreground">
            Badges
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {profile.badges.length}/{ALL_BADGE_IDS.length} earned
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {ALL_BADGE_IDS.map((bid) => (
            <BadgeTile key={bid} badgeId={bid} earned={earnedSet.has(bid)} />
          ))}
        </div>
      </div>

      {/* ─── Report History ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-3" data-ocid="profile.reports_section">
        <h2 className="font-display font-bold text-sm uppercase tracking-widest text-foreground">
          My Reports
        </h2>

        {/* Filter tabs */}
        <div
          className="flex gap-1 p-1 rounded-lg"
          style={{ background: "oklch(var(--muted))" }}
          data-ocid="profile.filter.tab"
          role="tablist"
        >
          {FILTER_TABS.map(({ label, value }) => (
            <button
              key={value}
              role="tab"
              aria-selected={statusFilter === value}
              type="button"
              onClick={() => setStatusFilter(value)}
              className="flex-1 py-1.5 rounded-md text-xs font-mono font-semibold uppercase tracking-wide transition-smooth"
              style={
                statusFilter === value
                  ? {
                      background: "oklch(var(--card))",
                      color: "oklch(var(--accent))",
                      border: "1px solid oklch(var(--accent) / 0.4)",
                    }
                  : {
                      color: "oklch(var(--muted-foreground))",
                    }
              }
              data-ocid={`profile.filter.${value}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Report list */}
        {reportsLoading ? (
          <div data-ocid="profile.reports_loading_state">
            {["a", "b", "c"].map((k) => (
              <Skeleton key={k} className="h-16 w-full rounded-xl mb-2" />
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-10 rounded-xl"
            style={{ border: "2px dashed oklch(var(--border))" }}
            data-ocid="profile.reports_empty_state"
          >
            <FileText className="w-7 h-7 text-muted-foreground" />
            <p className="text-xs font-body text-muted-foreground">
              {statusFilter === "all"
                ? "No reports yet. Be the first to report an issue!"
                : `No ${statusFilter} reports.`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2" data-ocid="profile.reports_list">
            {filteredReports.map((r, i) => (
              <ReportRow key={String(r.id)} report={r} index={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Report Row ────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  garbage: "Garbage",
  pollution: "Pollution",
  unsafe: "Unsafe Area",
  other: "Other",
};

function ReportRow({ report, index }: { report: ReportPublic; index: number }) {
  const date = new Date(
    Number(report.createdAt) / 1_000_000,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        background: "oklch(var(--card))",
        border: "2px solid oklch(var(--border))",
      }}
      data-ocid={`profile.report.item.${index}`}
    >
      {/* Photo thumbnail */}
      <div
        className="w-10 h-10 rounded-lg shrink-0 overflow-hidden flex items-center justify-center"
        style={{ background: "oklch(var(--accent) / 0.08)" }}
      >
        {report.photoUrl ? (
          <img
            src={report.photoUrl}
            alt="Report"
            className="w-full h-full object-cover"
          />
        ) : (
          <MapPin
            className="w-4 h-4"
            style={{ color: "oklch(var(--accent))" }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display font-semibold text-sm truncate">
            {CATEGORY_LABELS[report.category] ?? report.category}
          </span>
          <StatusPill status={report.status} />
        </div>
        <p className="text-[10px] font-mono text-muted-foreground truncate mt-0.5">
          {report.description || "No description provided"}
        </p>
      </div>

      {/* Date */}
      <span className="text-[10px] font-mono text-muted-foreground shrink-0 ml-1">
        {date}
      </span>
    </div>
  );
}
