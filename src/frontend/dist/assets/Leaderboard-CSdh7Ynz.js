import { c as createLucideIcon, u as useActor, b as useQuery, j as jsxRuntimeExports, O as Trophy, S as Skeleton, Q as Avatar, U as AvatarFallback, s as cn, d as createActor } from "./index-Ds37swa0.js";
import { B as Badge } from "./badge-Be4APrJW.js";
import { H as HardHat } from "./hard-hat-ClJl2CBJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { x: "2", y: "6", width: "20", height: "8", rx: "1", key: "1estib" }],
  ["path", { d: "M17 14v7", key: "7m2elx" }],
  ["path", { d: "M7 14v7", key: "1cm7wv" }],
  ["path", { d: "M17 3v3", key: "1v4jwn" }],
  ["path", { d: "M7 3v3", key: "7o6guu" }],
  ["path", { d: "M10 14 2.3 6.3", key: "1023jk" }],
  ["path", { d: "m14 6 7.7 7.7", key: "1s8pl2" }],
  ["path", { d: "m8 6 8 8", key: "hl96qh" }]
];
const Construction = createLucideIcon("construction", __iconNode);
const MEDAL = {
  1: {
    border: "oklch(0.82 0.18 85)",
    glow: "oklch(0.82 0.18 85 / 0.35)",
    bg: "oklch(0.82 0.18 85 / 0.12)",
    label: "oklch(0.82 0.18 85)",
    stamp: "GOLD"
  },
  2: {
    border: "oklch(0.78 0.04 260)",
    glow: "oklch(0.78 0.04 260 / 0.35)",
    bg: "oklch(0.78 0.04 260 / 0.1)",
    label: "oklch(0.78 0.04 260)",
    stamp: "SILVER"
  },
  3: {
    border: "oklch(0.65 0.13 44)",
    glow: "oklch(0.65 0.13 44 / 0.3)",
    bg: "oklch(0.65 0.13 44 / 0.1)",
    label: "oklch(0.65 0.13 44)",
    stamp: "BRONZE"
  }
};
function SteelPlateCard({
  entry,
  rank
}) {
  const medal = MEDAL[rank];
  const isFirst = rank === 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative flex flex-col items-center gap-2 p-3 rounded-lg flex-1 min-w-0",
      style: {
        background: medal.bg,
        border: `2px solid ${medal.border}`,
        boxShadow: `0 0 12px ${medal.glow}, inset 0 1px 0 ${medal.border}`,
        transform: isFirst ? "translateY(-6px)" : void 0
      },
      "data-ocid": `leaderboard.podium.item.${rank}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-sm font-mono font-bold text-[9px] tracking-widest",
            style: {
              background: medal.border,
              color: "oklch(0.12 0.02 260)",
              letterSpacing: "0.15em"
            },
            children: medal.stamp
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Avatar,
          {
            className: "border-2 mt-1",
            style: {
              borderColor: medal.border,
              width: isFirst ? "3rem" : "2.5rem",
              height: isFirst ? "3rem" : "2.5rem"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              AvatarFallback,
              {
                className: "font-mono font-bold text-xs",
                style: { background: medal.bg, color: medal.label },
                children: entry.username.slice(0, 2).toUpperCase()
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center w-full min-w-0 px-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-display font-bold text-xs truncate",
              style: { color: medal.label },
              children: entry.username
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-sm text-foreground tabular-nums", children: Number(entry.points).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground uppercase tracking-widest", children: "pts" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full opacity-60",
            style: { background: medal.border }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full opacity-60",
            style: { background: medal.border }
          }
        )
      ]
    }
  );
}
function LeaderRow({
  entry,
  index,
  isCurrentUser
}) {
  const rank = Number(entry.rank);
  const badgeCount = Number(entry.badgeCount);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth",
        isCurrentUser && "ring-1"
      ),
      style: {
        background: isCurrentUser ? "oklch(var(--primary) / 0.08)" : "oklch(var(--card))",
        border: isCurrentUser ? "2px solid oklch(var(--primary))" : "2px solid oklch(var(--border))",
        ...isCurrentUser ? { ringColor: "oklch(var(--primary))" } : {}
      },
      "data-ocid": `leaderboard.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-8 h-7 flex items-center justify-center rounded-sm shrink-0",
            style: {
              background: "oklch(var(--muted))",
              border: "1px solid oklch(var(--border))"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-xs text-muted-foreground", children: rank })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Avatar,
          {
            className: "w-8 h-8 border-2 shrink-0",
            style: {
              borderColor: isCurrentUser ? "oklch(var(--primary))" : "oklch(var(--border))"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              AvatarFallback,
              {
                className: "text-[10px] font-mono font-bold",
                style: {
                  background: isCurrentUser ? "oklch(var(--primary) / 0.15)" : "oklch(var(--card))",
                  color: isCurrentUser ? "oklch(var(--primary))" : "oklch(var(--muted-foreground))"
                },
                children: entry.username.slice(0, 2).toUpperCase()
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex items-center gap-1.5 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "font-display font-semibold text-sm truncate max-w-[120px]",
                isCurrentUser ? "text-foreground" : "text-foreground/80"
              ),
              children: entry.username
            }
          ),
          isCurrentUser && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: "text-[9px] font-mono uppercase tracking-widest px-1 py-0 h-4 shrink-0",
              style: {
                background: "oklch(var(--primary) / 0.15)",
                color: "oklch(var(--primary))",
                border: "1px solid oklch(var(--primary) / 0.4)"
              },
              children: "You"
            }
          ),
          badgeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 shrink-0", children: [
            Array.from(
              { length: Math.min(badgeCount, 4) },
              (_, i) => i + 1
            ).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              HardHat,
              {
                className: "w-3 h-3",
                style: { color: "oklch(var(--accent))" }
              },
              n
            )),
            badgeCount > 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-mono text-muted-foreground", children: [
              "+",
              badgeCount - 4
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono font-bold text-sm tabular-nums",
              style: {
                color: isCurrentUser ? "oklch(var(--primary))" : "oklch(var(--foreground))"
              },
              children: Number(entry.points).toLocaleString()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-muted-foreground uppercase tracking-widest", children: "pts" })
        ] })
      ]
    }
  );
}
function SkeletonRows() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    [1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Skeleton,
      {
        className: "h-16 w-full rounded-lg",
        "data-ocid": "leaderboard.loading_state"
      },
      k
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 mt-1", children: [1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-lg" }, k)) }),
    [1, 2, 3, 4, 5].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-lg" }, k))
  ] });
}
function Leaderboard() {
  const { actor, isFetching } = useActor(createActor);
  const queryEnabled = !!actor && !isFetching;
  const { data: entries, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: queryEnabled,
    refetchInterval: 3e4
  });
  const { data: myRankRaw } = useQuery({
    queryKey: ["myRank"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getMyRank();
    },
    enabled: queryEnabled,
    refetchInterval: 3e4
  });
  const myRank = myRankRaw ? Number(myRankRaw) : 0;
  const top3 = entries ? entries.slice(0, 3) : [];
  const rest = entries ? entries.slice(3) : [];
  const myEntryInTop50 = entries && myRank > 0 ? entries.find((e) => Number(e.rank) === myRank) : null;
  const myEntryPinned = myRank > 50 && myRank > 0 && entries ? entries.find((e) => Number(e.rank) === myRank) : null;
  const podiumOrder = [
    [top3[1], 2],
    [top3[0], 1],
    [top3[2], 3]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-4 px-4 py-5 max-w-2xl mx-auto",
      "data-ocid": "leaderboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-10 h-10 flex items-center justify-center rounded-lg shrink-0",
              style: {
                background: "oklch(var(--accent) / 0.1)",
                border: "2px solid oklch(var(--accent))"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Trophy,
                {
                  className: "w-5 h-5",
                  style: { color: "oklch(var(--accent))" }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl uppercase tracking-widest leading-none", children: "Leaderboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5", children: "Top civic contributors · refreshes every 30s" })
          ] })
        ] }),
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRows, {}),
        !isLoading && (!entries || entries.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center gap-3 py-14 rounded-lg mt-2",
            style: { border: "2px dashed oklch(var(--border))" },
            "data-ocid": "leaderboard.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Construction,
                {
                  className: "w-9 h-9 text-muted-foreground",
                  strokeWidth: 1.5
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground text-center px-6", children: "No contributors yet — be the first to report!" })
            ]
          }
        ),
        !isLoading && top3.length >= 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl p-4",
            style: {
              background: "linear-gradient(160deg, oklch(var(--card)) 0%, oklch(var(--muted) / 0.4) 100%)",
              border: "2px solid oklch(var(--primary))",
              boxShadow: "inset 0 1px 0 oklch(var(--primary) / 0.3)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-px flex-1",
                    style: { background: "oklch(var(--primary) / 0.4)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground", children: "Top Operators" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-px flex-1",
                    style: { background: "oklch(var(--primary) / 0.4)" }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 items-end", children: podiumOrder.map(
                ([entry, rank]) => entry ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SteelPlateCard,
                  {
                    entry,
                    rank
                  },
                  String(entry.userId)
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }, rank)
              ) })
            ]
          }
        ),
        !isLoading && rest.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", "data-ocid": "leaderboard.list", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 py-1 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-px flex-1",
                style: { background: "oklch(var(--border))" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground", children: "Full Rankings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-px flex-1",
                style: { background: "oklch(var(--border))" }
              }
            )
          ] }),
          rest.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            LeaderRow,
            {
              entry: e,
              index: i + 4,
              isCurrentUser: !!myEntryInTop50 && Number(e.rank) === myRank
            },
            String(e.userId)
          ))
        ] }),
        !isLoading && myEntryPinned && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-px flex-1",
                style: { background: "oklch(var(--border))" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground", children: "Your Position" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-px flex-1",
                style: { background: "oklch(var(--border))" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(LeaderRow, { entry: myEntryPinned, index: myRank, isCurrentUser: true })
        ] })
      ]
    }
  );
}
export {
  Leaderboard as default
};
