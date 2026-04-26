import type { backendInterface } from "../backend";
import { BadgeId, ReportCategory, ReportStatus } from "../backend";
import { Principal } from "@icp-sdk/core/principal";

const sampleUserId = Principal.fromText("aaaaa-aa");
const sampleUserId2 = Principal.fromText("2vxsx-fae");

export const mockBackend: backendInterface = {
  adminReply: async (_targetUserId, _content) => BigInt(1),

  getAdminInbox: async () => [sampleUserId2],

  getAdminThreadForUser: async (_userId) => [
    {
      id: BigInt(1),
      content: "Hello admin, I found a large garbage dump near the park.",
      isRead: true,
      sender: sampleUserId2,
      sentAt: BigInt(Date.now() - 3600000),
      isAdminReply: false,
    },
    {
      id: BigInt(2),
      content: "Thank you for reporting. Our team will investigate shortly.",
      isRead: false,
      sender: sampleUserId,
      sentAt: BigInt(Date.now() - 1800000),
      isAdminReply: true,
    },
  ],

  getAllReports: async () => [
    {
      id: BigInt(1),
      lat: 40.7128,
      lng: -74.006,
      status: ReportStatus.pending,
      createdAt: BigInt(Date.now() - 86400000),
      description: "Large illegal garbage dump near the river bank",
      photoUrl: "https://placehold.co/400x300/374151/9CA3AF?text=Garbage+Dump",
      category: ReportCategory.garbage,
      reporter: sampleUserId2,
    },
    {
      id: BigInt(2),
      lat: 40.7148,
      lng: -74.002,
      status: ReportStatus.approved,
      createdAt: BigInt(Date.now() - 172800000),
      description: "Chemical pollution in storm drain, strong smell",
      photoUrl: "https://placehold.co/400x300/374151/9CA3AF?text=Pollution",
      category: ReportCategory.pollution,
      reporter: sampleUserId,
    },
    {
      id: BigInt(3),
      lat: 40.71,
      lng: -74.009,
      status: ReportStatus.resolved,
      createdAt: BigInt(Date.now() - 259200000),
      description: "Broken glass and debris on sidewalk — unsafe for pedestrians",
      photoUrl: "https://placehold.co/400x300/374151/9CA3AF?text=Unsafe+Area",
      category: ReportCategory.unsafe,
      reporter: sampleUserId2,
    },
  ],

  getApprovedReports: async () => [
    {
      id: BigInt(2),
      lat: 40.7148,
      lng: -74.002,
      status: ReportStatus.approved,
      createdAt: BigInt(Date.now() - 172800000),
      description: "Chemical pollution in storm drain, strong smell",
      photoUrl: "https://placehold.co/400x300/374151/9CA3AF?text=Pollution",
      category: ReportCategory.pollution,
      reporter: sampleUserId,
    },
  ],

  getBadgeMetadata: async () => [
    { id: BadgeId.pioneer, icon: "🏆", name: "Pioneer", milestone: "Join CleanZone" },
    { id: BadgeId.first_report, icon: "📍", name: "First Report", milestone: "Submit your first report" },
    { id: BadgeId.ten_reports, icon: "⭐", name: "10 Reports", milestone: "Submit 10 reports" },
    { id: BadgeId.fifty_reports, icon: "🌟", name: "50 Reports", milestone: "Submit 50 reports" },
    { id: BadgeId.hundred_reports, icon: "💎", name: "100 Reports", milestone: "Submit 100 reports" },
    { id: BadgeId.eco_warrior, icon: "🌱", name: "Eco Warrior", milestone: "Have 5 reports resolved" },
  ],

  getChatHistory: async (_otherUserId) => [
    {
      id: BigInt(1),
      content: "Hey, did you see the pollution near 5th Ave?",
      isRead: true,
      sender: sampleUserId2,
      sentAt: BigInt(Date.now() - 7200000),
      chatId: "chat-1",
    },
    {
      id: BigInt(2),
      content: "Yes, I already submitted a report about it!",
      isRead: true,
      sender: sampleUserId,
      sentAt: BigInt(Date.now() - 3600000),
      chatId: "chat-1",
    },
  ],

  getChatList: async () => [
    {
      lastMessageAt: BigInt(Date.now() - 3600000),
      otherUsername: "eco_hunter",
      otherUserId: sampleUserId2,
      lastMessage: "Yes, I already submitted a report about it!",
      unreadCount: BigInt(0),
      chatId: "chat-1",
    },
  ],

  getHeatmapData: async () => [
    { lat: 40.7128, lng: -74.006, weight: BigInt(10) },
    { lat: 40.7148, lng: -74.002, weight: BigInt(7) },
    { lat: 40.71, lng: -74.009, weight: BigInt(5) },
    { lat: 40.7158, lng: -74.015, weight: BigInt(3) },
    { lat: 40.7098, lng: -74.001, weight: BigInt(8) },
  ],

  getLeaderboard: async () => [
    {
      username: "CleanStreets",
      userId: sampleUserId,
      rank: BigInt(1),
      badgeCount: BigInt(5),
      points: BigInt(2450),
    },
    {
      username: "eco_hunter",
      userId: sampleUserId2,
      rank: BigInt(2),
      badgeCount: BigInt(3),
      points: BigInt(1820),
    },
    {
      username: "GreenPatrol",
      userId: Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai"),
      rank: BigInt(3),
      badgeCount: BigInt(4),
      points: BigInt(1540),
    },
    {
      username: "UrbanWarden",
      userId: Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"),
      rank: BigInt(4),
      badgeCount: BigInt(2),
      points: BigInt(980),
    },
    {
      username: "CityGuard",
      userId: Principal.fromText("r7inp-6aaaa-aaaaa-aaabq-cai"),
      rank: BigInt(5),
      badgeCount: BigInt(1),
      points: BigInt(670),
    },
  ],

  getMyAdminThread: async () => [
    {
      id: BigInt(1),
      content: "Hello, I wanted to report a recurring issue with illegal dumping on Oak Street.",
      isRead: true,
      sender: sampleUserId,
      sentAt: BigInt(Date.now() - 86400000),
      isAdminReply: false,
    },
    {
      id: BigInt(2),
      content: "Thank you for your message. We've flagged this location for priority cleanup.",
      isRead: false,
      sender: sampleUserId2,
      sentAt: BigInt(Date.now() - 43200000),
      isAdminReply: true,
    },
  ],

  getMyProfile: async () => ({
    id: sampleUserId,
    reportCount: BigInt(12),
    username: "CleanStreets",
    badges: [BadgeId.pioneer, BadgeId.first_report, BadgeId.ten_reports],
    joinedAt: BigInt(Date.now() - 2592000000),
    avatarUrl: undefined,
    points: BigInt(2450),
  }),

  getMyRank: async () => BigInt(1),

  getReport: async (_reportId) => ({
    id: BigInt(1),
    lat: 40.7128,
    lng: -74.006,
    status: ReportStatus.pending,
    createdAt: BigInt(Date.now() - 86400000),
    description: "Large illegal garbage dump near the river bank",
    photoUrl: "https://placehold.co/400x300/374151/9CA3AF?text=Garbage+Dump",
    category: ReportCategory.garbage,
    reporter: sampleUserId2,
  }),

  getReportsByUser: async (_userId) => [
    {
      id: BigInt(1),
      lat: 40.7128,
      lng: -74.006,
      status: ReportStatus.pending,
      createdAt: BigInt(Date.now() - 86400000),
      description: "Large illegal garbage dump near the river bank",
      photoUrl: "https://placehold.co/400x300/374151/9CA3AF?text=Garbage+Dump",
      category: ReportCategory.garbage,
      reporter: sampleUserId,
    },
  ],

  getUnreadCount: async (_otherUserId) => BigInt(0),

  getUserProfile: async (_userId) => ({
    id: sampleUserId2,
    reportCount: BigInt(8),
    username: "eco_hunter",
    badges: [BadgeId.pioneer, BadgeId.first_report],
    joinedAt: BigInt(Date.now() - 1296000000),
    avatarUrl: undefined,
    points: BigInt(1820),
  }),

  markAdminMessagesRead: async (_userId) => undefined,

  markChatMessagesRead: async (_otherUserId) => undefined,

  registerProfile: async (username) => ({
    id: sampleUserId,
    reportCount: BigInt(0),
    username,
    badges: [BadgeId.pioneer],
    joinedAt: BigInt(Date.now()),
    avatarUrl: undefined,
    points: BigInt(0),
  }),

  sendChatMessage: async (_recipient, _content) => BigInt(3),

  sendMessageToAdmin: async (_content) => BigInt(3),

  submitReport: async (_args) => BigInt(4),

  updateAvatar: async (_avatarUrl) => true,

  updateReportStatus: async (_reportId, _status) => true,
};
