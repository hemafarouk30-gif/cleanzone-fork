import { createActor } from "@/backend";
import type { HeatmapPoint, ReportPublic } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  AlertTriangle,
  FileText,
  Flame,
  Layers,
  MapPin,
  Plus,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { ReportCategory, ReportStatus } from "../backend.d";

// ─── Fix default Leaflet icon paths for Vite ──────────────────────────────────

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_CENTER: [number, number] = [40.7128, -74.006]; // NYC fallback

// ─── Category marker colors ───────────────────────────────────────────────────

function categoryColor(c: ReportCategory): string {
  const map: Record<ReportCategory, string> = {
    [ReportCategory.garbage]: "#ef4444",
    [ReportCategory.pollution]: "#f97316",
    [ReportCategory.unsafe]: "#a855f7",
    [ReportCategory.other]: "#6b7280",
  };
  return map[c] ?? "#6b7280";
}

function categoryLabel(c: ReportCategory): string {
  const map: Record<ReportCategory, string> = {
    [ReportCategory.garbage]: "Garbage",
    [ReportCategory.pollution]: "Pollution",
    [ReportCategory.unsafe]: "Unsafe Area",
    [ReportCategory.other]: "Other",
  };
  return map[c] ?? String(c);
}

function statusLabel(s: ReportStatus): string {
  if (s === ReportStatus.resolved) return "Resolved";
  if (s === ReportStatus.approved) return "Approved";
  return "Pending";
}

function timeAgo(ts: bigint): string {
  const diffMs = Date.now() - Number(ts) / 1_000_000;
  const h = Math.floor(diffMs / 3_600_000);
  const d = Math.floor(diffMs / 86_400_000);
  if (h < 1) return "< 1 hr ago";
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

function categoryIcon(c: ReportCategory): React.ElementType {
  const map: Record<ReportCategory, React.ElementType> = {
    [ReportCategory.garbage]: FileText,
    [ReportCategory.pollution]: Flame,
    [ReportCategory.unsafe]: AlertTriangle,
    [ReportCategory.other]: MapPin,
  };
  return map[c] ?? MapPin;
}

// ─── Custom SVG marker icon ────────────────────────────────────────────────────

function createPinIcon(color: string): L.DivIcon {
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
    popupAnchor: [0, -36],
  });
}

// ─── User location dot icon ────────────────────────────────────────────────────

const userLocationIcon = L.divIcon({
  html: `<div style="width:18px;height:18px;background:rgb(59,130,246);border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,0.3)"></div>`,
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// ─── Auto-locate component ─────────────────────────────────────────────────────

function AutoLocate({
  onLocated,
}: { onLocated: (pos: [number, number]) => void }) {
  const map = useMap();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        map.setView(coords, 14);
        onLocated(coords);
      },
      () => {},
      { timeout: 8000 },
    );
  }, [map, onLocated]);

  return null;
}

// ─── Report Popup (selected report card overlay) ──────────────────────────────

function ReportPopup({
  report,
  onClose,
}: { report: ReportPublic; onClose: () => void }) {
  const CatIcon = categoryIcon(report.category);
  return (
    <div
      className="absolute bottom-24 left-4 right-4 rounded-xl overflow-hidden shadow-2xl z-[500] max-w-sm mx-auto"
      style={{
        background: "oklch(var(--card))",
        border: "2px solid oklch(var(--primary))",
      }}
      data-ocid="home.report_popup.dialog"
    >
      {report.photoUrl && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={report.photoUrl}
            alt={report.description}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <CatIcon
              className="w-4 h-4 shrink-0"
              style={{ color: "oklch(var(--accent))" }}
            />
            <p className="font-display font-bold text-sm uppercase tracking-widest text-foreground truncate">
              {categoryLabel(report.category)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(var(--accent)/0.15)",
                color: "oklch(var(--accent))",
                border: "1px solid oklch(var(--accent)/0.3)",
              }}
            >
              {statusLabel(report.status)}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded-full transition-smooth hover:bg-muted"
              aria-label="Close popup"
              data-ocid="home.report_popup.close_button"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
        <p className="text-sm font-body text-muted-foreground line-clamp-2 leading-relaxed">
          {report.description}
        </p>
        <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>
            {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
          </span>
          <span className="ml-auto">{timeAgo(report.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportPublic | null>(
    null,
  );
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  const { data: reports = [] } = useQuery<ReportPublic[]>({
    queryKey: ["approvedReports"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedReports();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: heatmapPoints = [] } = useQuery<HeatmapPoint[]>({
    queryKey: ["heatmapData"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHeatmapData();
    },
    enabled: !!actor && !isFetching,
  });

  const maxWeight =
    heatmapPoints.length > 0
      ? Math.max(...heatmapPoints.map((p) => Number(p.weight)), 1)
      : 1;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100svh - 56px)" }}
      data-ocid="home.page"
    >
      {/* Leaflet map fills full area */}
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        className="w-full h-full z-0"
        zoomControl={false}
        style={{ zIndex: 0 }}
        data-ocid="home.map.canvas_target"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        <AutoLocate onLocated={setUserLocation} />

        {/* User location blue dot */}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon} />
        )}

        {/* Heatmap circles */}
        {showHeatmap &&
          heatmapPoints.map((point, i) => {
            const intensity = Number(point.weight) / maxWeight;
            return (
              <Circle
                // biome-ignore lint/suspicious/noArrayIndexKey: stable order
                key={i}
                center={[point.lat, point.lng]}
                radius={200 + intensity * 400}
                pathOptions={{
                  fillColor: `rgba(249, 115, 22, ${0.4 * intensity})`,
                  fillOpacity: 0.5 * intensity,
                  color: "#f97316",
                  weight: 0,
                }}
              />
            );
          })}

        {/* Report pins */}
        {reports.map((report, i) => (
          <Marker
            // biome-ignore lint/suspicious/noArrayIndexKey: stable order
            key={i}
            position={[report.lat, report.lng]}
            icon={createPinIcon(categoryColor(report.category))}
            eventHandlers={{
              click: () => {
                setSelectedReport(report);
              },
            }}
          >
            <Popup>
              <div className="flex flex-col gap-1.5 min-w-[160px]">
                <p className="font-semibold text-sm">
                  {categoryLabel(report.category)}
                </p>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {report.description}
                </p>
                <span className="text-[10px] text-gray-400">
                  {timeAgo(report.createdAt)}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-[400]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13,17,23,0.9) 0%, rgba(13,17,23,0) 100%)",
        }}
      >
        <div>
          <h1 className="font-display font-bold text-sm uppercase tracking-widest text-foreground">
            Clean<span style={{ color: "oklch(var(--accent))" }}>Zone</span> Map
          </h1>
          <p className="text-[10px] font-mono text-muted-foreground">
            {reports.length} active report{reports.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowHeatmap((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-widest font-bold transition-smooth"
          style={
            showHeatmap
              ? {
                  background: "oklch(var(--accent))",
                  color: "oklch(var(--accent-foreground))",
                }
              : {
                  background: "oklch(var(--card))",
                  color: "oklch(var(--foreground))",
                  border: "2px solid oklch(var(--primary))",
                }
          }
          aria-label="Toggle heatmap"
          data-ocid="home.heatmap.toggle"
        >
          <Layers className="w-3.5 h-3.5" />
          Heat
        </button>
      </div>

      {/* Legend */}
      <div
        className="absolute top-14 left-4 flex flex-col gap-1.5 rounded-lg p-2.5 z-[400]"
        style={{
          background: "rgba(13,17,23,0.82)",
          border: "1px solid rgba(99,145,178,0.3)",
        }}
      >
        {[
          { color: "#ef4444", label: "Garbage" },
          { color: "#f97316", label: "Pollution" },
          { color: "#a855f7", label: "Unsafe" },
          { color: "#6b7280", label: "Other" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: color }}
            />
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              {label}
            </span>
          </div>
        ))}
        {showHeatmap && (
          <div className="flex items-center gap-1.5 border-t border-white/10 pt-1.5 mt-0.5">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: "rgba(249,115,22,0.6)" }}
            />
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Density
            </span>
          </div>
        )}
      </div>

      {/* Report count badge */}
      <div
        className="absolute bottom-6 left-4 flex items-center gap-2 rounded-lg px-3 py-2 z-[400]"
        style={{
          background: "rgba(13,17,23,0.88)",
          border: "1px solid rgba(99,145,178,0.3)",
        }}
      >
        <MapPin
          className="w-3.5 h-3.5"
          style={{ color: "oklch(var(--accent))" }}
        />
        <span className="font-mono text-xs text-foreground font-bold">
          {reports.length}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          {reports.length === 1 ? "Report" : "Reports"}
        </span>
      </div>

      {/* Selected report card */}
      {selectedReport && (
        <ReportPopup
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

      {/* FAB — + Report */}
      <button
        type="button"
        onClick={() => navigate({ to: "/reports" })}
        className="absolute bottom-6 right-4 w-14 h-14 rounded-full flex items-center justify-center z-[400] shadow-2xl transition-smooth hover:scale-110 active:scale-95"
        style={{
          background: "oklch(var(--accent))",
          color: "oklch(var(--accent-foreground))",
        }}
        aria-label="Submit new report"
        data-ocid="home.fab.primary_button"
      >
        <Plus className="w-7 h-7" strokeWidth={2.5} />
      </button>
    </div>
  );
}
