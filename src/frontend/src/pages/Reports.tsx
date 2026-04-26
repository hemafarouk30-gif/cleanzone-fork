import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { ReportPublic, SubmitReportArgs } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Camera,
  CheckCircle2,
  HelpCircle,
  ImageOff,
  Loader2,
  MapPin,
  Plus,
  ShieldAlert,
  Star,
  Trash2,
  Wind,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { toast } from "sonner";
import { ReportCategory, ReportStatus } from "../backend.d";

// ─── Fix default Leaflet icon paths ───────────────────────────────────────────

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_CENTER: [number, number] = [40.7128, -74.006];

const CATEGORY_ICONS: Record<ReportCategory, React.ElementType> = {
  [ReportCategory.garbage]: Trash2,
  [ReportCategory.pollution]: Wind,
  [ReportCategory.unsafe]: ShieldAlert,
  [ReportCategory.other]: HelpCircle,
};

const CATEGORY_LABELS: Record<ReportCategory, string> = {
  [ReportCategory.garbage]: "Garbage",
  [ReportCategory.pollution]: "Pollution",
  [ReportCategory.unsafe]: "Unsafe Area",
  [ReportCategory.other]: "Other",
};

const STATUS_CONFIG: Record<
  ReportStatus,
  { bg: string; text: string; border: string; label: string }
> = {
  [ReportStatus.pending]: {
    bg: "oklch(var(--muted))",
    text: "oklch(var(--muted-foreground))",
    border: "oklch(var(--border))",
    label: "Pending",
  },
  [ReportStatus.approved]: {
    bg: "oklch(var(--accent) / 0.15)",
    text: "oklch(var(--accent))",
    border: "oklch(var(--accent) / 0.4)",
    label: "Approved",
  },
  [ReportStatus.resolved]: {
    bg: "oklch(0.55 0.18 145 / 0.15)",
    text: "oklch(0.55 0.18 145)",
    border: "oklch(0.55 0.18 145 / 0.4)",
    label: "Resolved",
  },
};

const CATEGORY_FILTERS = [
  { value: "all", label: "All" },
  { value: ReportCategory.garbage, label: "Garbage" },
  { value: ReportCategory.pollution, label: "Pollution" },
  { value: ReportCategory.unsafe, label: "Unsafe" },
  { value: ReportCategory.other, label: "Other" },
];

const STATUS_FILTERS = [
  { value: "all", label: "All Status" },
  { value: ReportStatus.pending, label: "Pending" },
  { value: ReportStatus.approved, label: "Approved" },
  { value: ReportStatus.resolved, label: "Resolved" },
];

function timeAgo(ts: bigint): string {
  const diffMs = Date.now() - Number(ts) / 1_000_000;
  const h = Math.floor(diffMs / 3_600_000);
  const d = Math.floor(diffMs / 86_400_000);
  if (h < 1) return "< 1h ago";
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

// ─── Draggable marker + click-to-place ────────────────────────────────────────

const draggableMarkerIcon = L.divIcon({
  html: `<div style="width:28px;height:36px">
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z"
        fill="#f97316" style="filter:drop-shadow(0 2px 4px rgba(249,115,22,0.5))"/>
      <circle cx="14" cy="14" r="5.5" fill="white" opacity="0.95"/>
    </svg>
  </div>`,
  className: "",
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -36],
});

function LocationMarker({
  coords,
  onChange,
}: {
  coords: [number, number] | null;
  onChange: (c: [number, number]) => void;
}) {
  const map = useMap();

  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    if (coords) {
      map.setView(coords, map.getZoom(), { animate: true });
    }
  }, [coords, map]);

  if (!coords) return null;

  return (
    <Marker
      position={coords}
      icon={draggableMarkerIcon}
      draggable
      eventHandlers={{
        dragend(e) {
          const m = e.target as L.Marker;
          const pos = m.getLatLng();
          onChange([pos.lat, pos.lng]);
        },
      }}
    />
  );
}

function AutoCenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  const didRun = useRef(false);
  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    map.setView(coords, 15);
  }, [coords, map]);
  return null;
}

// ─── Location map picker ───────────────────────────────────────────────────────

type LocationState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "found"; coords: [number, number] }
  | { status: "denied" };

function LocationPicker({
  locationState,
  onCoordsChange,
  onRequestLocation,
}: {
  locationState: LocationState;
  onCoordsChange: (c: [number, number]) => void;
  onRequestLocation: () => void;
}) {
  const coords = locationState.status === "found" ? locationState.coords : null;
  const mapCenter = coords ?? DEFAULT_CENTER;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Location
        </span>
        {locationState.status !== "found" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRequestLocation}
            disabled={locationState.status === "locating"}
            className="border-2 font-mono text-[10px] uppercase tracking-widest gap-1.5 h-7 px-2"
            style={{ borderColor: "oklch(var(--primary))" }}
            data-ocid="submit_report.get_location_button"
          >
            {locationState.status === "locating" ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Locating…
              </>
            ) : (
              <>
                <MapPin className="w-3 h-3" />
                Use GPS
              </>
            )}
          </Button>
        )}
      </div>

      {/* Status bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono"
        style={
          locationState.status === "found"
            ? {
                background: "oklch(var(--accent) / 0.1)",
                border: "1px solid oklch(var(--accent) / 0.4)",
                color: "oklch(var(--accent))",
              }
            : {
                background: "oklch(var(--muted))",
                border: "1px solid oklch(var(--border))",
                color: "oklch(var(--muted-foreground))",
              }
        }
      >
        {locationState.status === "locating" && (
          <Loader2 className="w-3 h-3 animate-spin shrink-0" />
        )}
        <MapPin className="w-3 h-3 shrink-0" />
        {locationState.status === "idle" &&
          "Tap 'Use GPS' or click the map to place a pin"}
        {locationState.status === "locating" && "Getting your location…"}
        {locationState.status === "found" &&
          `Location found: ${locationState.coords[0].toFixed(5)}, ${locationState.coords[1].toFixed(5)}`}
        {locationState.status === "denied" &&
          "GPS denied — click the map below to place your pin manually"}
      </div>

      {/* Embedded mini-map */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          height: "180px",
          border: "2px solid oklch(var(--primary))",
          zIndex: 0,
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={13}
          className="w-full h-full"
          zoomControl={false}
          attributionControl={false}
          style={{ zIndex: 0, cursor: "crosshair" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          {coords && <AutoCenterMap coords={coords} />}
          <LocationMarker coords={coords} onChange={onCoordsChange} />
        </MapContainer>
      </div>

      {locationState.status === "found" && (
        <button
          type="button"
          onClick={() => onCoordsChange(locationState.coords)}
          className="self-start text-[10px] font-mono text-muted-foreground underline underline-offset-2"
        >
          Click map to adjust pin
        </button>
      )}
    </div>
  );
}

// ─── Photo Upload ─────────────────────────────────────────────────────────────

function PhotoUploader({
  onUploaded,
  previewUrl,
}: {
  onUploaded: (url: string) => void;
  previewUrl: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string>("");
  const [uploadPct, setUploadPct] = useState(0);

  const handleFile = useCallback(
    async (file: File) => {
      const objectUrl = URL.createObjectURL(file);
      setLocalPreview(objectUrl);
      setUploading(true);
      setUploadPct(0);
      try {
        let pct = 0;
        const interval = setInterval(() => {
          pct = Math.min(pct + 20, 90);
          setUploadPct(pct);
        }, 80);
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        clearInterval(interval);
        setUploadPct(100);
        onUploaded(dataUrl);
      } catch {
        toast.error("Photo upload failed. Try again.");
        setLocalPreview("");
        URL.revokeObjectURL(objectUrl);
      } finally {
        setUploading(false);
      }
    },
    [onUploaded],
  );

  const displayUrl = previewUrl || localPreview;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        Photo
      </span>
      {displayUrl ? (
        <div
          className="relative rounded-lg overflow-hidden"
          style={{ border: "2px solid oklch(var(--primary))" }}
        >
          <img
            src={displayUrl}
            alt="Evidence capture"
            className="w-full h-32 object-cover"
          />
          {uploading && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{ background: "oklch(0 0 0 / 0.55)" }}
            >
              <div
                className="w-2/3 h-2 rounded-full overflow-hidden"
                style={{ background: "oklch(var(--muted))" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${uploadPct}%`,
                    background: "oklch(var(--accent))",
                  }}
                />
              </div>
              <span
                className="text-xs font-mono"
                style={{ color: "oklch(var(--foreground))" }}
              >
                {uploadPct}%
              </span>
            </div>
          )}
          <button
            type="button"
            aria-label="Remove capture"
            onClick={() => {
              setLocalPreview("");
              onUploaded("");
            }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              background: "oklch(var(--destructive))",
              color: "oklch(var(--destructive-foreground))",
            }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          data-ocid="submit_report.photo_upload_button"
          className="flex flex-col items-center justify-center gap-2 w-full h-24 rounded-lg border-dashed border-2 transition-smooth hover:border-primary"
          style={{
            borderColor: "oklch(var(--border))",
            background: "oklch(var(--muted) / 0.5)",
          }}
        >
          <Camera className="w-5 h-5 text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {uploading ? "Uploading…" : "Tap to add capture"}
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
    </div>
  );
}

// ─── Submit Modal ─────────────────────────────────────────────────────────────

function SubmitModal({
  open,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (args: SubmitReportArgs) => void;
  loading: boolean;
}) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ReportCategory>(
    ReportCategory.garbage,
  );
  const [photoUrl, setPhotoUrl] = useState("");
  const [locationState, setLocationState] = useState<LocationState>({
    status: "idle",
  });

  const coords = locationState.status === "found" ? locationState.coords : null;

  const handleClose = () => {
    setDescription("");
    setCategory(ReportCategory.garbage);
    setPhotoUrl("");
    setLocationState({ status: "idle" });
    onClose();
  };

  const requestLocation = () => {
    setLocationState({ status: "locating" });
    if (!navigator.geolocation) {
      setLocationState({ status: "denied" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationState({
          status: "found",
          coords: [pos.coords.latitude, pos.coords.longitude],
        });
      },
      () => {
        toast.error("GPS denied — click the map to place your pin manually.");
        setLocationState({ status: "denied" });
      },
      { timeout: 10000 },
    );
  };

  const handleMapCoordsChange = (c: [number, number]) => {
    setLocationState({ status: "found", coords: c });
  };

  // Validation flags
  const missingDescription = !description.trim();
  const missingLocation = !coords;
  const canSubmit = !loading && !missingDescription && !missingLocation;

  const handleSubmit = () => {
    if (missingLocation) {
      toast.error("Please set a location on the map.");
      return;
    }
    if (missingDescription) {
      toast.error("Please add a description.");
      return;
    }
    onSubmit({
      description,
      photoUrl,
      category,
      lat: coords[0],
      lng: coords[1],
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-sm rounded-xl p-5 flex flex-col gap-4 overflow-y-auto max-h-[92svh]"
        style={{ border: "2px solid oklch(var(--primary))" }}
        data-ocid="submit_report.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-bold uppercase tracking-widest text-base flex items-center gap-2">
            <Plus
              className="w-4 h-4"
              style={{ color: "oklch(var(--accent))" }}
            />
            New Report
          </DialogTitle>
        </DialogHeader>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="report-category"
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground"
          >
            Category
          </label>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as ReportCategory)}
          >
            <SelectTrigger
              className="border-2 font-body"
              style={{ borderColor: "oklch(var(--primary))" }}
              data-ocid="submit_report.category_select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                <SelectItem key={val} value={val}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Photo upload */}
        <PhotoUploader
          onUploaded={(url) => setPhotoUrl(url)}
          previewUrl={photoUrl}
        />

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="report-description"
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground"
          >
            Description{" "}
            {missingDescription && (
              <span className="text-destructive normal-case">*required</span>
            )}
          </label>
          <Textarea
            id="report-description"
            placeholder="Describe the issue clearly…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-2 font-body resize-none min-h-[64px]"
            style={{
              borderColor: missingDescription
                ? "oklch(var(--destructive) / 0.5)"
                : "oklch(var(--border))",
            }}
            data-ocid="submit_report.description_textarea"
          />
        </div>

        {/* Location map */}
        <LocationPicker
          locationState={locationState}
          onCoordsChange={handleMapCoordsChange}
          onRequestLocation={requestLocation}
        />

        {/* Validation summary */}
        {!canSubmit && (missingDescription || missingLocation) && (
          <div
            className="flex flex-col gap-1 px-3 py-2 rounded-lg text-[10px] font-mono"
            style={{
              background: "oklch(var(--destructive) / 0.08)",
              border: "1px solid oklch(var(--destructive) / 0.3)",
              color: "oklch(var(--destructive))",
            }}
            data-ocid="submit_report.error_state"
          >
            {missingDescription && <span>• Add a description</span>}
            {missingLocation && <span>• Set a location on the map</span>}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full font-display font-bold uppercase tracking-widest"
          style={{
            background: "oklch(var(--accent))",
            color: "oklch(var(--accent-foreground))",
            border: "none",
            opacity: canSubmit ? 1 : 0.5,
          }}
          data-ocid="submit_report.submit_button"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting…
            </span>
          ) : (
            "Submit Report"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ─── Success Modal ────────────────────────────────────────────────────────────

function SuccessModal({
  open,
  onClose,
  reportId,
  points,
}: {
  open: boolean;
  onClose: () => void;
  reportId: bigint | null;
  points: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-xs rounded-xl p-8 flex flex-col items-center gap-5 text-center"
        style={{ border: "2px solid oklch(0.55 0.18 145)" }}
        data-ocid="submit_success.dialog"
      >
        <CheckCircle2
          className="w-12 h-12"
          style={{ color: "oklch(0.55 0.18 145)" }}
        />
        <div className="flex flex-col gap-1">
          <h2 className="font-display font-bold text-lg uppercase tracking-widest text-foreground">
            Report Filed!
          </h2>
          <p className="text-xs font-mono text-muted-foreground">
            Thank you for keeping your city clean.
          </p>
        </div>
        {reportId !== null && (
          <div
            className="w-full flex flex-col gap-1 px-4 py-3 rounded-lg"
            style={{
              background: "oklch(var(--muted))",
              border: "1px solid oklch(var(--border))",
            }}
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Report ID
            </span>
            <span className="font-mono text-sm text-foreground font-bold">
              #{String(reportId).padStart(4, "0")}
            </span>
          </div>
        )}
        <div
          className="flex items-center gap-2 px-5 py-2 rounded-full"
          style={{
            background: "oklch(var(--accent) / 0.15)",
            border: "1px solid oklch(var(--accent) / 0.4)",
          }}
        >
          <Star className="w-4 h-4" style={{ color: "oklch(var(--accent))" }} />
          <span
            className="font-display font-bold text-sm"
            style={{ color: "oklch(var(--accent))" }}
          >
            +{points} points earned
          </span>
        </div>
        <Button
          onClick={onClose}
          className="w-full font-display font-bold uppercase tracking-widest"
          style={{
            background: "oklch(var(--accent))",
            color: "oklch(var(--accent-foreground))",
            border: "none",
          }}
          data-ocid="submit_success.close_button"
        >
          Keep Reporting
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({
  report,
  onClose,
}: {
  report: ReportPublic | null;
  onClose: () => void;
}) {
  if (!report) return null;
  const status =
    STATUS_CONFIG[report.status] ?? STATUS_CONFIG[ReportStatus.pending];
  const CatIcon = CATEGORY_ICONS[report.category] ?? HelpCircle;

  return (
    <Dialog open={!!report} onOpenChange={onClose}>
      <DialogContent
        className="max-w-sm rounded-xl p-0 overflow-hidden"
        style={{ border: "2px solid oklch(var(--primary))" }}
        data-ocid="report_detail.dialog"
      >
        {report.photoUrl ? (
          <img
            src={report.photoUrl}
            alt="Report evidence"
            className="w-full h-44 object-cover"
          />
        ) : (
          <div
            className="w-full h-28 flex items-center justify-center"
            style={{ background: "oklch(var(--muted))" }}
          >
            <ImageOff className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "oklch(var(--accent) / 0.1)" }}
              >
                <CatIcon
                  className="w-4 h-4"
                  style={{ color: "oklch(var(--accent))" }}
                />
              </div>
              <div>
                <p className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
                  {CATEGORY_LABELS[report.category]}
                </p>
                <p className="text-[10px] font-mono text-muted-foreground">
                  {timeAgo(report.createdAt)}
                </p>
              </div>
            </div>
            <span
              className="text-[10px] font-mono px-2.5 py-1 rounded-full shrink-0 font-semibold"
              style={{
                background: status.bg,
                color: status.text,
                border: `1px solid ${status.border}`,
              }}
            >
              {status.label}
            </span>
          </div>

          <p className="font-body text-sm text-foreground leading-relaxed">
            {report.description}
          </p>

          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{
              background: "oklch(var(--muted))",
              border: "1px solid oklch(var(--border))",
            }}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground">
              {report.lat.toFixed(5)}, {report.lng.toFixed(5)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Reporter:
            </span>
            <span className="font-mono text-[10px] text-foreground truncate">
              {report.reporter.toText().slice(0, 20)}…
            </span>
          </div>

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full font-mono text-xs uppercase tracking-widest border-2"
            style={{ borderColor: "oklch(var(--border))" }}
            data-ocid="report_detail.close_button"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Report Card ──────────────────────────────────────────────────────────────

function ReportCard({
  report,
  index,
  onSelect,
}: {
  report: ReportPublic;
  index: number;
  onSelect: (r: ReportPublic) => void;
}) {
  const status =
    STATUS_CONFIG[report.status] ?? STATUS_CONFIG[ReportStatus.pending];
  const CatIcon = CATEGORY_ICONS[report.category] ?? HelpCircle;

  return (
    <button
      type="button"
      className="w-full text-left flex gap-3 p-4 rounded-xl transition-smooth card-industrial hover:shadow-steel"
      onClick={() => onSelect(report)}
      data-ocid={`reports.item.${index}`}
    >
      {report.photoUrl ? (
        <img
          src={report.photoUrl}
          alt=""
          className="w-14 h-14 rounded-lg object-cover shrink-0"
          style={{ border: "1px solid oklch(var(--border))" }}
        />
      ) : (
        <div
          className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: "oklch(var(--accent) / 0.08)",
            border: "1px solid oklch(var(--border))",
          }}
        >
          <CatIcon
            className="w-6 h-6"
            style={{ color: "oklch(var(--accent))" }}
          />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <CatIcon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            <p className="font-display font-semibold text-sm text-foreground capitalize truncate">
              {CATEGORY_LABELS[report.category]}
            </p>
          </div>
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 font-semibold"
            style={{
              background: status.bg,
              color: status.text,
              border: `1px solid ${status.border}`,
            }}
          >
            {status.label}
          </span>
        </div>
        <p className="font-body text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {report.description}
        </p>
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground mt-0.5">
          <MapPin className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">
            {report.lat.toFixed(3)}, {report.lng.toFixed(3)}
          </span>
          <span className="ml-auto shrink-0">{timeAgo(report.createdAt)}</span>
        </div>
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Reports() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<ReportPublic | null>(
    null,
  );
  const [successData, setSuccessData] = useState<{
    id: bigint;
    points: number;
  } | null>(null);

  const { data: reports, isLoading } = useQuery<ReportPublic[]>({
    queryKey: ["allReports"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReports();
    },
    enabled: !!actor && !isFetching,
  });

  const submitMutation = useMutation({
    mutationFn: async (args: SubmitReportArgs) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitReport(args);
    },
    onSuccess: (reportId) => {
      queryClient.invalidateQueries({ queryKey: ["allReports"] });
      queryClient.invalidateQueries({ queryKey: ["approvedReports"] });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      setModalOpen(false);
      setSuccessData({ id: reportId, points: 50 });
    },
    onError: () => toast.error("Failed to submit report. Try again."),
  });

  const filtered = (reports ?? []).filter(
    (r) =>
      (catFilter === "all" || r.category === catFilter) &&
      (statusFilter === "all" || r.status === statusFilter),
  );

  return (
    <div className="flex flex-col gap-5 px-4 py-5 max-w-2xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl uppercase tracking-widest">
            Reports
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            {isLoading
              ? "…"
              : `${filtered.length} issue${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="gap-2 font-display font-bold uppercase tracking-wider text-sm rounded-lg"
          style={{
            background: "oklch(var(--accent))",
            color: "oklch(var(--accent-foreground))",
            border: "none",
          }}
          data-ocid="reports.new_report_button"
        >
          <Plus className="w-4 h-4" />
          Report
        </Button>
      </div>

      {/* Category filters */}
      <div className="flex flex-col gap-2">
        <div
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          data-ocid="reports.category_filter_tabs"
        >
          {CATEGORY_FILTERS.map(({ value, label }) => (
            <button
              type="button"
              key={value}
              onClick={() => setCatFilter(value)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-widest shrink-0 transition-smooth"
              style={
                catFilter === value
                  ? {
                      background: "oklch(var(--accent))",
                      color: "oklch(var(--accent-foreground))",
                    }
                  : {
                      background: "oklch(var(--muted))",
                      color: "oklch(var(--muted-foreground))",
                      border: "1px solid oklch(var(--border))",
                    }
              }
              data-ocid={`reports.cat_filter.${value}_tab`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest shrink-0">
            Status:
          </span>
          <div
            className="flex gap-1.5 overflow-x-auto scrollbar-hide"
            data-ocid="reports.status_filter_tabs"
          >
            {STATUS_FILTERS.map(({ value, label }) => (
              <button
                type="button"
                key={value}
                onClick={() => setStatusFilter(value)}
                className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest shrink-0 transition-smooth"
                style={
                  statusFilter === value
                    ? {
                        background: "oklch(var(--primary))",
                        color: "oklch(var(--primary-foreground))",
                      }
                    : {
                        background: "oklch(var(--muted) / 0.5)",
                        color: "oklch(var(--muted-foreground))",
                        border: "1px solid oklch(var(--border))",
                      }
                }
                data-ocid={`reports.status_filter.${value}_tab`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Report list */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          ["a", "b", "c", "d"].map((k) => (
            <Skeleton key={k} className="h-24 w-full rounded-xl" />
          ))
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center gap-3 py-14 rounded-xl"
            style={{ border: "2px dashed oklch(var(--border))" }}
            data-ocid="reports.empty_state"
          >
            <Trash2 className="w-9 h-9 text-muted-foreground" />
            <div className="text-center">
              <p className="font-display font-semibold text-sm text-foreground">
                No reports found
              </p>
              <p className="font-body text-xs text-muted-foreground mt-1">
                {catFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters."
                  : "Be the first to report an issue!"}
              </p>
            </div>
            {catFilter === "all" && statusFilter === "all" && (
              <Button
                onClick={() => setModalOpen(true)}
                size="sm"
                className="font-display font-bold uppercase tracking-widest text-xs gap-2 mt-1"
                style={{
                  background: "oklch(var(--accent))",
                  color: "oklch(var(--accent-foreground))",
                  border: "none",
                }}
                data-ocid="reports.empty_state_report_button"
              >
                <Plus className="w-3.5 h-3.5" />
                New Report
              </Button>
            )}
          </div>
        ) : (
          filtered.map((r, i) => (
            <ReportCard
              key={String(r.id)}
              report={r}
              index={i + 1}
              onSelect={setSelectedReport}
            />
          ))
        )}
      </div>

      <SubmitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(args) => submitMutation.mutate(args)}
        loading={submitMutation.isPending}
      />

      <SuccessModal
        open={!!successData}
        onClose={() => setSuccessData(null)}
        reportId={successData?.id ?? null}
        points={successData?.points ?? 0}
      />

      <DetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
}
