import type { Principal } from "@icp-sdk/core/principal";
import type {
  AdminMessagePublic,
  BadgeId,
  ChatMessagePublic,
  ChatPreview,
  HeatmapPoint,
  LeaderboardEntry,
  ReportCategory,
  ReportPublic,
  ReportStatus,
  SubmitReportArgs,
  UserProfilePublic,
} from "../backend.d";

export type { Principal };
export type {
  LeaderboardEntry,
  UserProfilePublic,
  ReportPublic,
  ChatPreview,
  ChatMessagePublic,
  AdminMessagePublic,
  HeatmapPoint,
  BadgeId,
  ReportCategory,
  ReportStatus,
  SubmitReportArgs,
};

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export type AuthStatus =
  | "loading"
  | "anonymous"
  | "registering"
  | "authenticated";
