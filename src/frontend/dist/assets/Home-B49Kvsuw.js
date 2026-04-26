import { c as createLucideIcon, r as reactExports, u as useActor, a as useNavigate, b as useQuery, j as jsxRuntimeExports, T as TriangleAlert, F as FileText, d as createActor } from "./index-Ds37swa0.js";
import { c as createPathComponent, l as leafletSrcExports, a as createElementObject, e as extendContext, b as createOverlayComponent, M as MapContainer, T as TileLayer, d as Marker, P as Plus, u as useMap, L } from "./TileLayer-C6HqyWb4.js";
import { M as MapPin, R as ReportCategory, a as ReportStatus } from "./backend.d-UNwspDzN.js";
import { X } from "./x-B4yMahrI.js";
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
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode$1);
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
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode);
function updateCircle(layer, props, prevProps) {
  if (props.center !== prevProps.center) {
    layer.setLatLng(props.center);
  }
  if (props.radius != null && props.radius !== prevProps.radius) {
    layer.setRadius(props.radius);
  }
}
const Circle = createPathComponent(function createCircle({ center, children: _c, ...options }, ctx) {
  const circle = new leafletSrcExports.Circle(center, options);
  return createElementObject(circle, extendContext(ctx, {
    overlayContainer: circle
  }));
}, updateCircle);
const Popup = createOverlayComponent(function createPopup(props, context) {
  const popup = new leafletSrcExports.Popup(props, context.overlayContainer);
  return createElementObject(popup, context);
}, function usePopupLifecycle(element, context, { position }, setOpen) {
  reactExports.useEffect(function addPopup() {
    const { instance } = element;
    function onPopupOpen(event) {
      if (event.popup === instance) {
        instance.update();
        setOpen(true);
      }
    }
    function onPopupClose(event) {
      if (event.popup === instance) {
        setOpen(false);
      }
    }
    context.map.on({
      popupopen: onPopupOpen,
      popupclose: onPopupClose
    });
    if (context.overlayContainer == null) {
      if (position != null) {
        instance.setLatLng(position);
      }
      instance.openOn(context.map);
    } else {
      context.overlayContainer.bindPopup(instance);
    }
    return function removePopup() {
      var _a;
      context.map.off({
        popupopen: onPopupOpen,
        popupclose: onPopupClose
      });
      (_a = context.overlayContainer) == null ? void 0 : _a.unbindPopup();
      context.map.removeLayer(instance);
    };
  }, [
    element,
    context,
    setOpen,
    position
  ]);
});
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});
const DEFAULT_CENTER = [40.7128, -74.006];
function categoryColor(c) {
  const map = {
    [ReportCategory.garbage]: "#ef4444",
    [ReportCategory.pollution]: "#f97316",
    [ReportCategory.unsafe]: "#a855f7",
    [ReportCategory.other]: "#6b7280"
  };
  return map[c] ?? "#6b7280";
}
function categoryLabel(c) {
  const map = {
    [ReportCategory.garbage]: "Garbage",
    [ReportCategory.pollution]: "Pollution",
    [ReportCategory.unsafe]: "Unsafe Area",
    [ReportCategory.other]: "Other"
  };
  return map[c] ?? String(c);
}
function statusLabel(s) {
  if (s === ReportStatus.resolved) return "Resolved";
  if (s === ReportStatus.approved) return "Approved";
  return "Pending";
}
function timeAgo(ts) {
  const diffMs = Date.now() - Number(ts) / 1e6;
  const h = Math.floor(diffMs / 36e5);
  const d = Math.floor(diffMs / 864e5);
  if (h < 1) return "< 1 hr ago";
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}
function categoryIcon(c) {
  const map = {
    [ReportCategory.garbage]: FileText,
    [ReportCategory.pollution]: Flame,
    [ReportCategory.unsafe]: TriangleAlert,
    [ReportCategory.other]: MapPin
  };
  return map[c] ?? MapPin;
}
function createPinIcon(color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <filter id="s" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${color}" flood-opacity="0.4"/>
    </filter>
    <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z"
      fill="${color}" filter="url(#s)"/>
    <circle cx="14" cy="14" r="5" fill="white" opacity="0.9"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36]
  });
}
const userLocationIcon = L.divIcon({
  html: `<div style="width:18px;height:18px;background:rgb(59,130,246);border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,0.3)"></div>`,
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});
function AutoLocate({
  onLocated
}) {
  const map = useMap();
  const didRun = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [
          pos.coords.latitude,
          pos.coords.longitude
        ];
        map.setView(coords, 14);
        onLocated(coords);
      },
      () => {
      },
      { timeout: 8e3 }
    );
  }, [map, onLocated]);
  return null;
}
function ReportPopup({
  report,
  onClose
}) {
  const CatIcon = categoryIcon(report.category);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "absolute bottom-24 left-4 right-4 rounded-xl overflow-hidden shadow-2xl z-[500] max-w-sm mx-auto",
      style: {
        background: "oklch(var(--card))",
        border: "2px solid oklch(var(--primary))"
      },
      "data-ocid": "home.report_popup.dialog",
      children: [
        report.photoUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-36 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: report.photoUrl,
              alt: report.description,
              className: "w-full h-full object-cover"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CatIcon,
                {
                  className: "w-4 h-4 shrink-0",
                  style: { color: "oklch(var(--accent))" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm uppercase tracking-widest text-foreground truncate", children: categoryLabel(report.category) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[10px] font-mono px-2 py-0.5 rounded-full",
                  style: {
                    background: "oklch(var(--accent)/0.15)",
                    color: "oklch(var(--accent))",
                    border: "1px solid oklch(var(--accent)/0.3)"
                  },
                  children: statusLabel(report.status)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "w-6 h-6 flex items-center justify-center rounded-full transition-smooth hover:bg-muted",
                  "aria-label": "Close popup",
                  "data-ocid": "home.report_popup.close_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5 text-muted-foreground" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-muted-foreground line-clamp-2 leading-relaxed", children: report.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs font-mono text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              report.lat.toFixed(4),
              ", ",
              report.lng.toFixed(4)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto", children: timeAgo(report.createdAt) })
          ] })
        ] })
      ]
    }
  );
}
function Home() {
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();
  const [showHeatmap, setShowHeatmap] = reactExports.useState(false);
  const [selectedReport, setSelectedReport] = reactExports.useState(
    null
  );
  const [userLocation, setUserLocation] = reactExports.useState(
    null
  );
  const { data: reports = [] } = useQuery({
    queryKey: ["approvedReports"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedReports();
    },
    enabled: !!actor && !isFetching
  });
  const { data: heatmapPoints = [] } = useQuery({
    queryKey: ["heatmapData"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHeatmapData();
    },
    enabled: !!actor && !isFetching
  });
  const maxWeight = heatmapPoints.length > 0 ? Math.max(...heatmapPoints.map((p) => Number(p.weight)), 1) : 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full overflow-hidden",
      style: { height: "calc(100svh - 56px)" },
      "data-ocid": "home.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          MapContainer,
          {
            center: DEFAULT_CENTER,
            zoom: 13,
            className: "w-full h-full z-0",
            zoomControl: false,
            style: { zIndex: 0 },
            "data-ocid": "home.map.canvas_target",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TileLayer,
                {
                  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                  maxZoom: 19
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AutoLocate, { onLocated: setUserLocation }),
              userLocation && /* @__PURE__ */ jsxRuntimeExports.jsx(Marker, { position: userLocation, icon: userLocationIcon }),
              showHeatmap && heatmapPoints.map((point, i) => {
                const intensity = Number(point.weight) / maxWeight;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Circle,
                  {
                    center: [point.lat, point.lng],
                    radius: 200 + intensity * 400,
                    pathOptions: {
                      fillColor: `rgba(249, 115, 22, ${0.4 * intensity})`,
                      fillOpacity: 0.5 * intensity,
                      color: "#f97316",
                      weight: 0
                    }
                  },
                  i
                );
              }),
              reports.map((report, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Marker,
                {
                  position: [report.lat, report.lng],
                  icon: createPinIcon(categoryColor(report.category)),
                  eventHandlers: {
                    click: () => {
                      setSelectedReport(report);
                    }
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Popup, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 min-w-[160px]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: categoryLabel(report.category) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600 line-clamp-2", children: report.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400", children: timeAgo(report.createdAt) })
                  ] }) })
                },
                i
              ))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-[400]",
            style: {
              background: "linear-gradient(to bottom, rgba(13,17,23,0.9) 0%, rgba(13,17,23,0) 100%)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-sm uppercase tracking-widest text-foreground", children: [
                  "Clean",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(var(--accent))" }, children: "Zone" }),
                  " Map"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-mono text-muted-foreground", children: [
                  reports.length,
                  " active report",
                  reports.length !== 1 ? "s" : ""
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setShowHeatmap((v) => !v),
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-widest font-bold transition-smooth",
                  style: showHeatmap ? {
                    background: "oklch(var(--accent))",
                    color: "oklch(var(--accent-foreground))"
                  } : {
                    background: "oklch(var(--card))",
                    color: "oklch(var(--foreground))",
                    border: "2px solid oklch(var(--primary))"
                  },
                  "aria-label": "Toggle heatmap",
                  "data-ocid": "home.heatmap.toggle",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-3.5 h-3.5" }),
                    "Heat"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute top-14 left-4 flex flex-col gap-1.5 rounded-lg p-2.5 z-[400]",
            style: {
              background: "rgba(13,17,23,0.82)",
              border: "1px solid rgba(99,145,178,0.3)"
            },
            children: [
              [
                { color: "#ef4444", label: "Garbage" },
                { color: "#f97316", label: "Pollution" },
                { color: "#a855f7", label: "Unsafe" },
                { color: "#6b7280", label: "Other" }
              ].map(({ color, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-2.5 h-2.5 rounded-full shrink-0",
                    style: { background: color }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest", children: label })
              ] }, label)),
              showHeatmap && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 border-t border-white/10 pt-1.5 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-2.5 h-2.5 rounded-full shrink-0",
                    style: { background: "rgba(249,115,22,0.6)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest", children: "Density" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute bottom-6 left-4 flex items-center gap-2 rounded-lg px-3 py-2 z-[400]",
            style: {
              background: "rgba(13,17,23,0.88)",
              border: "1px solid rgba(99,145,178,0.3)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MapPin,
                {
                  className: "w-3.5 h-3.5",
                  style: { color: "oklch(var(--accent))" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground font-bold", children: reports.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest", children: reports.length === 1 ? "Report" : "Reports" })
            ]
          }
        ),
        selectedReport && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReportPopup,
          {
            report: selectedReport,
            onClose: () => setSelectedReport(null)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: "/reports" }),
            className: "absolute bottom-6 right-4 w-14 h-14 rounded-full flex items-center justify-center z-[400] shadow-2xl transition-smooth hover:scale-110 active:scale-95",
            style: {
              background: "oklch(var(--accent))",
              color: "oklch(var(--accent-foreground))"
            },
            "aria-label": "Submit new report",
            "data-ocid": "home.fab.primary_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-7 h-7", strokeWidth: 2.5 })
          }
        )
      ]
    }
  );
}
export {
  Home as default
};
