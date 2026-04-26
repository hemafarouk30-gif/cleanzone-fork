import { createActor } from "@/backend";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Construction, HardHat, Trophy } from "lucide-react";

// ─── Medal colors ──────────────────────────────────────────────────────────

const MEDAL = {
  1: {
    border: "oklch(0.82 0.18 85)",
    glow: "oklch(0.82 0.18 85 / 0.35)",
    bg: "oklch(0.82 0.18 85 / 0.12)",
    label: "oklch(0.82 0.18 85)",
    stamp: "GOLD",
  },
  2: {
    border: "oklch(0.78 0.04 260)",
    glow: "oklch(0.78 0.04 260 / 0.35)",
    bg: "oklch(0.78 0.04 260 / 0.1)",
    label: "oklch(0.78 0.04 260)",
    stamp: "SILVER",
  },
  3: {
    border: "oklch(0.65 0.13 44)",
    glow: "oklch(0.65 0.13 44 / 0.3)",
    bg: "oklch(0.65 0.13 44 / 0.1)",
    label: "oklch(0.65 0.13 44)",
    stamp: "BRONZE",
  },
} as const;

type MedalRank = 1 | 2 | 3;

// ─── Steel Plate Top-3 card ────────────────────────────────────────────────

function SteelPlateCard({
  entry,
  rank,
}: {
  entry: LeaderboardEntry;
  rank: MedalRank;
}) {
  const medal = MEDAL[rank];
  const isFirst = rank === 1;

  return (
    <div
      className="relative flex flex-col items-center gap-2 p-3 rounded-lg flex-1 min-w-0"
      style={{
        background: medal.bg,
        border: `2px solid ${medal.border}`,
        boxShadow: `0 0 12px ${medal.glow}, inset 0 1px 0 ${medal.border}`,
        transform: isFirst ? "translateY(-6px)" : undefined,
      }}
      data-ocid={`leaderboard.podium.item.${rank}`}
    >
      {/* Rank stamp */}
      <div
        className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-sm font-mono font-bold text-[9px] tracking-widest"
        style={{
          background: medal.border,
          color: "oklch(0.12 0.02 260)",
          letterSpacing: "0.15em",
        }}
      >
        {medal.stamp}
      </div>

      <Avatar
        className="border-2 mt-1"
        style={{
          borderColor: medal.border,
          width: isFirst ? "3rem" : "2.5rem",
          height: isFirst ? "3rem" : "2.5rem",
        }}
      >
        <AvatarFallback
          className="font-mono font-bold text-xs"
          style={{ background: medal.bg, color: medal.label }}
        >
          {entry.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="text-center w-full min-w-0 px-1">
        <p
          className="font-display font-bold text-xs truncate"
          style={{ color: medal.label }}
        >
          {entry.username}
        </p>
        <p className="font-mono font-bold text-sm text-foreground tabular-nums">
          {Number(entry.points).toLocaleString()}
        </p>
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
          pts
        </p>
      </div>

      {/* Rivet decorations */}
      <div
        className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full opacity-60"
        style={{ background: medal.border }}
      />
      <div
        className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full opacity-60"
        style={{ background: medal.border }}
      />
    </div>
  );
}

// ─── Standard row ──────────────────────────────────────────────────────────

function LeaderRow({
  entry,
  index,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  index: number;
  isCurrentUser: boolean;
}) {
  const rank = Number(entry.rank);
  const badgeCount = Number(entry.badgeCount);

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth",
        isCurrentUser && "ring-1",
      )}
      style={{
        background: isCurrentUser
          ? "oklch(var(--primary) / 0.08)"
          : "oklch(var(--card))",
        border: isCurrentUser
          ? "2px solid oklch(var(--primary))"
          : "2px solid oklch(var(--border))",
        ...(isCurrentUser ? { ringColor: "oklch(var(--primary))" } : {}),
      }}
      data-ocid={`leaderboard.item.${index}`}
    >
      {/* Rank number — styled as industrial stamp */}
      <div
        className="w-8 h-7 flex items-center justify-center rounded-sm shrink-0"
        style={{
          background: "oklch(var(--muted))",
          border: "1px solid oklch(var(--border))",
        }}
      >
        <span className="font-mono font-bold text-xs text-muted-foreground">
          {rank}
        </span>
      </div>

      <Avatar
        className="w-8 h-8 border-2 shrink-0"
        style={{
          borderColor: isCurrentUser
            ? "oklch(var(--primary))"
            : "oklch(var(--border))",
        }}
      >
        <AvatarFallback
          className="text-[10px] font-mono font-bold"
          style={{
            background: isCurrentUser
              ? "oklch(var(--primary) / 0.15)"
              : "oklch(var(--card))",
            color: isCurrentUser
              ? "oklch(var(--primary))"
              : "oklch(var(--muted-foreground))",
          }}
        >
          {entry.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Name + badges */}
      <div className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
        <span
          className={cn(
            "font-display font-semibold text-sm truncate max-w-[120px]",
            isCurrentUser ? "text-foreground" : "text-foreground/80",
          )}
        >
          {entry.username}
        </span>
        {isCurrentUser && (
          <Badge
            className="text-[9px] font-mono uppercase tracking-widest px-1 py-0 h-4 shrink-0"
            style={{
              background: "oklch(var(--primary) / 0.15)",
              color: "oklch(var(--primary))",
              border: "1px solid oklch(var(--primary) / 0.4)",
            }}
          >
            You
          </Badge>
        )}
        {/* Badge icons (up to 4 shown) */}
        {badgeCount > 0 && (
          <div className="flex items-center gap-0.5 shrink-0">
            {Array.from(
              { length: Math.min(badgeCount, 4) },
              (_, i) => i + 1,
            ).map((n) => (
              <HardHat
                key={n}
                className="w-3 h-3"
                style={{ color: "oklch(var(--accent))" }}
              />
            ))}
            {badgeCount > 4 && (
              <span className="text-[9px] font-mono text-muted-foreground">
                +{badgeCount - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Points */}
      <div className="flex flex-col items-end shrink-0">
        <span
          className="font-mono font-bold text-sm tabular-nums"
          style={{
            color: isCurrentUser
              ? "oklch(var(--primary))"
              : "oklch(var(--foreground))",
          }}
        >
          {Number(entry.points).toLocaleString()}
        </span>
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
          pts
        </span>
      </div>
    </div>
  );
}

// ─── Skeleton rows ─────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {[1, 2, 3].map((k) => (
        <Skeleton
          key={k}
          className="h-16 w-full rounded-lg"
          data-ocid="leaderboard.loading_state"
        />
      ))}
      <div className="grid grid-cols-3 gap-3 mt-1">
        {[1, 2, 3].map((k) => (
          <Skeleton key={k} className="h-28 w-full rounded-lg" />
        ))}
      </div>
      {[1, 2, 3, 4, 5].map((k) => (
        <Skeleton key={k} className="h-12 w-full rounded-lg" />
      ))}
    </>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────

export default function Leaderboard() {
  const { actor, isFetching } = useActor(createActor);
  const queryEnabled = !!actor && !isFetching;

  const { data: entries, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: queryEnabled,
    refetchInterval: 30_000,
  });

  const { data: myRankRaw } = useQuery<bigint>({
    queryKey: ["myRank"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getMyRank();
    },
    enabled: queryEnabled,
    refetchInterval: 30_000,
  });

  const myRank = myRankRaw ? Number(myRankRaw) : 0;
  const top3 = entries ? entries.slice(0, 3) : [];
  const rest = entries ? entries.slice(3) : [];
  const myEntryInTop50 =
    entries && myRank > 0
      ? entries.find((e) => Number(e.rank) === myRank)
      : null;
  const myEntryPinned =
    myRank > 50 && myRank > 0 && entries
      ? entries.find((e) => Number(e.rank) === myRank)
      : null;

  // Arrange top-3 slots: [2nd, 1st, 3rd]
  const podiumOrder: [LeaderboardEntry | undefined, MedalRank][] = [
    [top3[1], 2],
    [top3[0], 1],
    [top3[2], 3],
  ];

  return (
    <div
      className="flex flex-col gap-4 px-4 py-5 max-w-2xl mx-auto"
      data-ocid="leaderboard.page"
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-lg shrink-0"
          style={{
            background: "oklch(var(--accent) / 0.1)",
            border: "2px solid oklch(var(--accent))",
          }}
        >
          <Trophy
            className="w-5 h-5"
            style={{ color: "oklch(var(--accent))" }}
          />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl uppercase tracking-widest leading-none">
            Leaderboard
          </h1>
          <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">
            Top civic contributors · refreshes every 30s
          </p>
        </div>
      </div>

      {/* ── Loading ── */}
      {isLoading && <SkeletonRows />}

      {/* ── Empty ── */}
      {!isLoading && (!entries || entries.length === 0) && (
        <div
          className="flex flex-col items-center gap-3 py-14 rounded-lg mt-2"
          style={{ border: "2px dashed oklch(var(--border))" }}
          data-ocid="leaderboard.empty_state"
        >
          <Construction
            className="w-9 h-9 text-muted-foreground"
            strokeWidth={1.5}
          />
          <p className="font-body text-sm text-muted-foreground text-center px-6">
            No contributors yet — be the first to report!
          </p>
        </div>
      )}

      {/* ── Podium (industrial steel plates) ── */}
      {!isLoading && top3.length >= 1 && (
        <div
          className="rounded-xl p-4"
          style={{
            background:
              "linear-gradient(160deg, oklch(var(--card)) 0%, oklch(var(--muted) / 0.4) 100%)",
            border: "2px solid oklch(var(--primary))",
            boxShadow: "inset 0 1px 0 oklch(var(--primary) / 0.3)",
          }}
        >
          {/* Industrial header */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className="h-px flex-1"
              style={{ background: "oklch(var(--primary) / 0.4)" }}
            />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Top Operators
            </span>
            <div
              className="h-px flex-1"
              style={{ background: "oklch(var(--primary) / 0.4)" }}
            />
          </div>

          {/* Steel plates row — 2nd · 1st · 3rd */}
          <div className="flex gap-2 items-end">
            {podiumOrder.map(([entry, rank]) =>
              entry ? (
                <SteelPlateCard
                  key={String(entry.userId)}
                  entry={entry}
                  rank={rank}
                />
              ) : (
                <div key={rank} className="flex-1" />
              ),
            )}
          </div>
        </div>
      )}

      {/* ── Ranked list (4th and below) ── */}
      {!isLoading && rest.length > 0 && (
        <div className="flex flex-col gap-1.5" data-ocid="leaderboard.list">
          {/* Section label */}
          <div className="flex items-center gap-2 py-1 mb-1">
            <div
              className="h-px flex-1"
              style={{ background: "oklch(var(--border))" }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Full Rankings
            </span>
            <div
              className="h-px flex-1"
              style={{ background: "oklch(var(--border))" }}
            />
          </div>
          {rest.map((e, i) => (
            <LeaderRow
              key={String(e.userId)}
              entry={e}
              index={i + 4}
              isCurrentUser={!!myEntryInTop50 && Number(e.rank) === myRank}
            />
          ))}
        </div>
      )}

      {/* ── Pinned current user row (outside top 50) ── */}
      {!isLoading && myEntryPinned && (
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center gap-2 py-1">
            <div
              className="h-px flex-1"
              style={{ background: "oklch(var(--border))" }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Your Position
            </span>
            <div
              className="h-px flex-1"
              style={{ background: "oklch(var(--border))" }}
            />
          </div>
          <LeaderRow entry={myEntryPinned} index={myRank} isCurrentUser />
        </div>
      )}
    </div>
  );
}
