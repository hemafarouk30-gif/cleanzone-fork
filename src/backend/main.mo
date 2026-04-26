import List "mo:core/List";
import Principal "mo:core/Principal";

import UserTypes "types/users";
import ReportTypes "types/reports";
import MsgTypes "types/messaging";
import CommonTypes "types/common";

import UsersApi "mixins/users-api";
import ReportsApi "mixins/reports-api";
import MessagingApi "mixins/messaging-api";

actor {
  // ─── Admin configuration ───────────────────────────────────────────────────
  // Replace with the actual admin principal before deployment.
  let adminPrincipal : CommonTypes.UserId = Principal.fromText("aaaaa-aa");

  // ─── Domain state ──────────────────────────────────────────────────────────
  let users = List.empty<UserTypes.UserProfile>();

  let reports = List.empty<ReportTypes.Report>();
  let reportIdCounter = List.singleton<Nat>(0);

  let adminMessages = List.empty<MsgTypes.AdminMessage>();
  let adminMsgIdCounter = List.singleton<Nat>(0);

  let chatMessages = List.empty<MsgTypes.ChatMessage>();
  let chatMsgIdCounter = List.singleton<Nat>(0);

  // ─── Mixin composition ─────────────────────────────────────────────────────
  include UsersApi(users);
  include ReportsApi(reports, reportIdCounter, users, adminPrincipal);
  include MessagingApi(adminMessages, adminMsgIdCounter, chatMessages, chatMsgIdCounter, users, adminPrincipal);
};
