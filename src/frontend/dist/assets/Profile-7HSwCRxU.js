import { c as createLucideIcon, V as useAuth, u as useActor, H as useQueryClient, r as reactExports, b as useQuery, j as jsxRuntimeExports, S as Skeleton, Q as Avatar, U as AvatarFallback, X as Input, I as Button, O as Trophy, F as FileText, d as createActor } from "./index-Ds37swa0.js";
import { u as useMutation, a as ue } from "./index-Coer_joW.js";
import { B as BadgeId, a as ReportStatus, M as MapPin } from "./backend.d-UNwspDzN.js";
import { H as HardHat } from "./hard-hat-ClJl2CBJ.js";
import { C as Check, S as Star } from "./star-B-tkzwja.js";
import { X } from "./x-B4yMahrI.js";
import { L as Lock } from "./lock-DoS7YRJb.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
      key: "nnexq3"
    }
  ],
  ["path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12", key: "mt58a7" }]
];
const Leaf = createLucideIcon("leaf", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const BADGE_META = {
  [BadgeId.pioneer]: {
    label: "Pioneer",
    desc: "One of the first to join CleanZone",
    icon: Shield,
    color: "oklch(0.62 0.2 258)"
  },
  [BadgeId.first_report]: {
    label: "First Report",
    desc: "Submitted your first report",
    icon: FileText,
    color: "oklch(0.7 0.22 44)"
  },
  [BadgeId.ten_reports]: {
    label: "10 Reports",
    desc: "Submitted 10 reports",
    icon: Star,
    color: "oklch(0.72 0.18 145)"
  },
  [BadgeId.fifty_reports]: {
    label: "50 Reports",
    desc: "Submitted 50 reports",
    icon: Zap,
    color: "oklch(0.65 0.2 30)"
  },
  [BadgeId.hundred_reports]: {
    label: "100 Reports",
    desc: "Submitted 100 reports",
    icon: Award,
    color: "oklch(0.82 0.18 85)"
  },
  [BadgeId.eco_warrior]: {
    label: "Eco Warrior",
    desc: "Completed the eco challenge",
    icon: Leaf,
    color: "oklch(0.58 0.2 145)"
  }
};
const ALL_BADGE_IDS = [
  BadgeId.first_report,
  BadgeId.ten_reports,
  BadgeId.fifty_reports,
  BadgeId.hundred_reports,
  BadgeId.pioneer,
  BadgeId.eco_warrior
];
const STATUS_LABELS = {
  [ReportStatus.pending]: "Pending",
  [ReportStatus.approved]: "Approved",
  [ReportStatus.resolved]: "Resolved"
};
const STATUS_STYLES = {
  [ReportStatus.pending]: {
    bg: "oklch(var(--muted))",
    text: "oklch(var(--muted-foreground))",
    dot: "oklch(0.65 0.1 60)"
  },
  [ReportStatus.approved]: {
    bg: "oklch(0.55 0.14 258 / 0.18)",
    text: "oklch(0.55 0.14 258)",
    dot: "oklch(0.55 0.14 258)"
  },
  [ReportStatus.resolved]: {
    bg: "oklch(0.55 0.16 145 / 0.18)",
    text: "oklch(0.55 0.16 145)",
    dot: "oklch(0.55 0.16 145)"
  }
};
function StatCard({
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center gap-1 p-4 rounded-xl flex-1",
      style: {
        background: accent ? "oklch(var(--accent) / 0.08)" : "oklch(var(--card))",
        border: accent ? "2px solid oklch(var(--accent) / 0.5)" : "2px solid oklch(var(--border))"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono font-bold text-xl",
            style: {
              color: accent ? "oklch(var(--accent))" : "oklch(var(--foreground))"
            },
            children: value
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-muted-foreground uppercase tracking-widest text-center", children: label })
      ]
    }
  );
}
function StatusPill({ status }) {
  const s = STATUS_STYLES[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wide",
      style: { background: s.bg, color: s.text },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "w-1.5 h-1.5 rounded-full shrink-0",
            style: { background: s.dot }
          }
        ),
        STATUS_LABELS[status]
      ]
    }
  );
}
function BadgeTile({ badgeId, earned }) {
  const meta = BADGE_META[badgeId];
  const Icon = meta.icon;
  if (!earned) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-2 p-3 rounded-xl text-center opacity-40",
        style: {
          background: "oklch(var(--muted) / 0.3)",
          border: "2px dashed oklch(var(--border))"
        },
        "data-ocid": `profile.badge_locked.${badgeId}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 flex items-center justify-center rounded-lg bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-muted-foreground", children: meta.label })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center gap-2 p-3 rounded-xl text-center",
      style: {
        background: "oklch(var(--card))",
        border: `2px solid ${meta.color}33`,
        boxShadow: `0 0 8px ${meta.color}18`
      },
      title: meta.desc,
      "data-ocid": `profile.badge.${badgeId}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-9 h-9 flex items-center justify-center rounded-lg",
            style: { background: `${meta.color}22` },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5", style: { color: meta.color } })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[10px] font-mono font-semibold",
            style: { color: meta.color },
            children: meta.label
          }
        )
      ]
    }
  );
}
const FILTER_TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: ReportStatus.pending },
  { label: "Approved", value: ReportStatus.approved },
  { label: "Resolved", value: ReportStatus.resolved }
];
function Profile() {
  const { profile, refetchProfile } = useAuth();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [editing, setEditing] = reactExports.useState(false);
  const [newUsername, setNewUsername] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const { data: myReports, isLoading: reportsLoading } = useQuery({
    queryKey: ["myReports", profile == null ? void 0 : profile.id],
    queryFn: async () => {
      if (!actor || !profile) return [];
      return actor.getReportsByUser(profile.id);
    },
    enabled: !!actor && !isFetching && !!profile
  });
  const { data: myRank } = useQuery({
    queryKey: ["myRank"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getMyRank();
    },
    enabled: !!actor && !isFetching && !!profile
  });
  const updateUsernameMutation = useMutation({
    mutationFn: async (username) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerProfile(username);
    },
    onSuccess: async () => {
      ue.success("Username updated!");
      await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      await refetchProfile();
      setEditing(false);
    },
    onError: () => ue.error("Failed to update username.")
  });
  const startEdit = () => {
    setNewUsername((profile == null ? void 0 : profile.username) ?? "");
    setEditing(true);
  };
  if (!profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col gap-4 px-4 py-5 max-w-2xl mx-auto",
        "data-ocid": "profile.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 w-full rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full rounded-xl" })
        ]
      }
    );
  }
  const joinedDate = new Date(
    Number(profile.joinedAt) / 1e6
  ).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  const rankDisplay = myRank ? `#${Number(myRank)}` : "—";
  const filteredReports = statusFilter === "all" ? myReports ?? [] : (myReports ?? []).filter((r) => r.status === statusFilter);
  const earnedSet = new Set(profile.badges);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-5 px-4 py-5 max-w-2xl mx-auto",
      "data-ocid": "profile.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col gap-5 p-5 rounded-xl",
            style: {
              background: "oklch(var(--card))",
              border: "2px solid oklch(var(--primary))"
            },
            "data-ocid": "profile.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Avatar,
                    {
                      className: "w-16 h-16 border-2",
                      style: { borderColor: "oklch(var(--accent))" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AvatarFallback,
                        {
                          className: "text-xl font-mono font-bold",
                          style: {
                            background: "oklch(var(--accent) / 0.15)",
                            color: "oklch(var(--accent))"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(HardHat, { className: "w-7 h-7" })
                        }
                      )
                    }
                  ),
                  myRank && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-full font-mono font-bold text-[9px] leading-none",
                      style: {
                        background: "oklch(var(--accent))",
                        color: "oklch(var(--accent-foreground))",
                        border: "1.5px solid oklch(var(--card))"
                      },
                      children: [
                        "#",
                        Number(myRank)
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: newUsername,
                        onChange: (e) => setNewUsername(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter")
                            updateUsernameMutation.mutate(newUsername);
                          if (e.key === "Escape") setEditing(false);
                        },
                        className: "border-2 font-mono h-8 text-sm",
                        style: { borderColor: "oklch(var(--primary))" },
                        "data-ocid": "profile.username_input",
                        autoFocus: true,
                        maxLength: 24
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        size: "icon",
                        className: "w-8 h-8 shrink-0",
                        onClick: () => updateUsernameMutation.mutate(newUsername),
                        disabled: !newUsername.trim() || updateUsernameMutation.isPending,
                        style: { background: "oklch(var(--accent))", border: "none" },
                        "data-ocid": "profile.save_button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Check,
                          {
                            className: "w-4 h-4",
                            style: { color: "oklch(var(--accent-foreground))" }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        size: "icon",
                        variant: "outline",
                        className: "w-8 h-8 shrink-0 border-2",
                        onClick: () => setEditing(false),
                        style: { borderColor: "oklch(var(--border))" },
                        "data-ocid": "profile.cancel_button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-lg tracking-wide truncate", children: profile.username }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: startEdit,
                        className: "p-1 rounded transition-smooth hover:bg-muted/50",
                        "aria-label": "Edit username",
                        "data-ocid": "profile.edit_button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5 text-muted-foreground" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-muted-foreground", children: [
                      "Joined ",
                      joinedDate
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "inline-flex items-center gap-1 text-xs font-mono font-semibold",
                        style: { color: "oklch(var(--accent))" },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-3 h-3" }),
                          "Rank ",
                          rankDisplay
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex flex-col items-center justify-center rounded-xl px-3 py-2 shrink-0",
                    style: {
                      background: "oklch(var(--accent) / 0.1)",
                      border: "2px solid oklch(var(--accent) / 0.4)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono font-bold text-2xl leading-none",
                          style: { color: "oklch(var(--accent))" },
                          children: Number(profile.points).toLocaleString()
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5", children: "pts" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", "data-ocid": "profile.stats", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Reports", value: Number(profile.reportCount) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Badges", value: profile.badges.length }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Rank", value: rankDisplay, accent: true })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", "data-ocid": "profile.badges_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-sm uppercase tracking-widest text-foreground", children: "Badges" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
              profile.badges.length,
              "/",
              ALL_BADGE_IDS.length,
              " earned"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: ALL_BADGE_IDS.map((bid) => /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTile, { badgeId: bid, earned: earnedSet.has(bid) }, bid)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", "data-ocid": "profile.reports_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-sm uppercase tracking-widest text-foreground", children: "My Reports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex gap-1 p-1 rounded-lg",
              style: { background: "oklch(var(--muted))" },
              "data-ocid": "profile.filter.tab",
              role: "tablist",
              children: FILTER_TABS.map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  role: "tab",
                  "aria-selected": statusFilter === value,
                  type: "button",
                  onClick: () => setStatusFilter(value),
                  className: "flex-1 py-1.5 rounded-md text-xs font-mono font-semibold uppercase tracking-wide transition-smooth",
                  style: statusFilter === value ? {
                    background: "oklch(var(--card))",
                    color: "oklch(var(--accent))",
                    border: "1px solid oklch(var(--accent) / 0.4)"
                  } : {
                    color: "oklch(var(--muted-foreground))"
                  },
                  "data-ocid": `profile.filter.${value}`,
                  children: label
                },
                value
              ))
            }
          ),
          reportsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "profile.reports_loading_state", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl mb-2" }, k)) }) : filteredReports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-2 py-10 rounded-xl",
              style: { border: "2px dashed oklch(var(--border))" },
              "data-ocid": "profile.reports_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-7 h-7 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground", children: statusFilter === "all" ? "No reports yet. Be the first to report an issue!" : `No ${statusFilter} reports.` })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", "data-ocid": "profile.reports_list", children: filteredReports.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ReportRow, { report: r, index: i + 1 }, String(r.id))) })
        ] })
      ]
    }
  );
}
const CATEGORY_LABELS = {
  garbage: "Garbage",
  pollution: "Pollution",
  unsafe: "Unsafe Area",
  other: "Other"
};
function ReportRow({ report, index }) {
  const date = new Date(
    Number(report.createdAt) / 1e6
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 px-4 py-3 rounded-xl",
      style: {
        background: "oklch(var(--card))",
        border: "2px solid oklch(var(--border))"
      },
      "data-ocid": `profile.report.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-10 h-10 rounded-lg shrink-0 overflow-hidden flex items-center justify-center",
            style: { background: "oklch(var(--accent) / 0.08)" },
            children: report.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: report.photoUrl,
                alt: "Report",
                className: "w-full h-full object-cover"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              MapPin,
              {
                className: "w-4 h-4",
                style: { color: "oklch(var(--accent))" }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm truncate", children: CATEGORY_LABELS[report.category] ?? report.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: report.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-muted-foreground truncate mt-0.5", children: report.description || "No description provided" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-muted-foreground shrink-0 ml-1", children: date })
      ]
    }
  );
}
export {
  Profile as default
};
