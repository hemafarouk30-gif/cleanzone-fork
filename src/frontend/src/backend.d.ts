import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    username: string;
    userId: UserId;
    rank: bigint;
    badgeCount: bigint;
    points: bigint;
}
export type Timestamp = bigint;
export type ChatId = string;
export interface BadgeMetadata {
    id: BadgeId;
    icon: string;
    name: string;
    milestone: string;
}
export interface UserProfilePublic {
    id: UserId;
    reportCount: bigint;
    username: string;
    badges: Array<BadgeId>;
    joinedAt: Timestamp;
    avatarUrl?: string;
    points: bigint;
}
export type UserId = Principal;
export type ReportId = bigint;
export interface ReportPublic {
    id: ReportId;
    lat: number;
    lng: number;
    status: ReportStatus;
    createdAt: Timestamp;
    description: string;
    photoUrl: string;
    category: ReportCategory;
    reporter: UserId;
}
export type MessageId = bigint;
export interface HeatmapPoint {
    lat: number;
    lng: number;
    weight: bigint;
}
export interface SubmitReportArgs {
    lat: number;
    lng: number;
    description: string;
    photoUrl: string;
    category: ReportCategory;
}
export interface ChatPreview {
    lastMessageAt: Timestamp;
    otherUsername: string;
    otherUserId: UserId;
    lastMessage: string;
    unreadCount: bigint;
    chatId: ChatId;
}
export interface ChatMessagePublic {
    id: MessageId;
    content: string;
    isRead: boolean;
    sender: UserId;
    sentAt: Timestamp;
    chatId: ChatId;
}
export interface AdminMessagePublic {
    id: MessageId;
    content: string;
    isRead: boolean;
    sender: UserId;
    sentAt: Timestamp;
    isAdminReply: boolean;
}
export enum BadgeId {
    pioneer = "pioneer",
    hundred_reports = "hundred_reports",
    ten_reports = "ten_reports",
    first_report = "first_report",
    fifty_reports = "fifty_reports",
    eco_warrior = "eco_warrior"
}
export enum ReportCategory {
    other = "other",
    garbage = "garbage",
    unsafe = "unsafe",
    pollution = "pollution"
}
export enum ReportStatus {
    resolved = "resolved",
    pending = "pending",
    approved = "approved"
}
export interface backendInterface {
    adminReply(targetUserId: UserId, content: string): Promise<MessageId>;
    getAdminInbox(): Promise<Array<UserId>>;
    getAdminThreadForUser(userId: UserId): Promise<Array<AdminMessagePublic>>;
    getAllReports(): Promise<Array<ReportPublic>>;
    getApprovedReports(): Promise<Array<ReportPublic>>;
    getBadgeMetadata(): Promise<Array<BadgeMetadata>>;
    getChatHistory(otherUserId: UserId): Promise<Array<ChatMessagePublic>>;
    getChatList(): Promise<Array<ChatPreview>>;
    getHeatmapData(): Promise<Array<HeatmapPoint>>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getMyAdminThread(): Promise<Array<AdminMessagePublic>>;
    getMyProfile(): Promise<UserProfilePublic | null>;
    getMyRank(): Promise<bigint>;
    getReport(reportId: ReportId): Promise<ReportPublic | null>;
    getReportsByUser(userId: UserId): Promise<Array<ReportPublic>>;
    getUnreadCount(otherUserId: UserId): Promise<bigint>;
    getUserProfile(userId: UserId): Promise<UserProfilePublic | null>;
    markAdminMessagesRead(userId: UserId): Promise<void>;
    markChatMessagesRead(otherUserId: UserId): Promise<void>;
    registerProfile(username: string): Promise<UserProfilePublic>;
    sendChatMessage(recipient: UserId, content: string): Promise<MessageId>;
    sendMessageToAdmin(content: string): Promise<MessageId>;
    submitReport(args: SubmitReportArgs): Promise<ReportId>;
    updateAvatar(avatarUrl: string | null): Promise<boolean>;
    updateReportStatus(reportId: ReportId, status: ReportStatus): Promise<boolean>;
}
