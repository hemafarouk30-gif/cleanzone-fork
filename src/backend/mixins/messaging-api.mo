import Common "../types/common";
import MsgTypes "../types/messaging";
import UserTypes "../types/users";
import MsgLib "../lib/messaging";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

mixin (
  adminMessages : List.List<MsgTypes.AdminMessage>,
  adminMsgIdCounter : List.List<Nat>,
  chatMessages : List.List<MsgTypes.ChatMessage>,
  chatMsgIdCounter : List.List<Nat>,
  users : List.List<UserTypes.UserProfile>,
  adminPrincipal : Common.UserId,
) {
  // ─── Admin messaging ───────────────────────────────────────────────────────

  /// Send a message to the admin.
  public shared ({ caller }) func sendMessageToAdmin(content : Text) : async Common.MessageId {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    if (content.size() == 0) { Runtime.trap("Content cannot be empty") };
    let (msgId, newId) = MsgLib.sendMessageToAdmin(adminMessages, adminMsgIdCounter.at(0), caller, content);
    adminMsgIdCounter.put(0, newId);
    msgId;
  };

  /// Admin replies to a user's message thread.
  public shared ({ caller }) func adminReply(targetUserId : Common.UserId, content : Text) : async Common.MessageId {
    if (not Principal.equal(caller, adminPrincipal)) { Runtime.trap("Not authorized") };
    if (content.size() == 0) { Runtime.trap("Content cannot be empty") };
    let (msgId, newId) = MsgLib.adminReply(adminMessages, adminMsgIdCounter.at(0), adminPrincipal, targetUserId, content);
    adminMsgIdCounter.put(0, newId);
    msgId;
  };

  /// Get the full admin thread for the caller (user view).
  public shared query ({ caller }) func getMyAdminThread() : async [MsgTypes.AdminMessagePublic] {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    MsgLib.getAdminThread(adminMessages, caller);
  };

  /// Get the full admin thread for any user (admin view).
  public shared query ({ caller }) func getAdminThreadForUser(userId : Common.UserId) : async [MsgTypes.AdminMessagePublic] {
    if (not Principal.equal(caller, adminPrincipal)) { Runtime.trap("Not authorized") };
    MsgLib.getAdminThread(adminMessages, userId);
  };

  /// List all user IDs that have started an admin thread (admin view).
  public shared query ({ caller }) func getAdminInbox() : async [Common.UserId] {
    if (not Principal.equal(caller, adminPrincipal)) { Runtime.trap("Not authorized") };
    MsgLib.getAllAdminThreadUsers(adminMessages);
  };

  /// Mark admin thread messages as read.
  /// - Admin calling: pass a userId to mark that user's messages as read in the admin view.
  /// - User calling: pass their own principal to mark admin replies as read.
  public shared ({ caller }) func markAdminMessagesRead(userId : Common.UserId) : async () {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    let isAdmin = Principal.equal(caller, adminPrincipal);
    // Admin can mark any user's thread; user can only mark their own
    if (not isAdmin and not Principal.equal(caller, userId)) {
      Runtime.trap("Not authorized");
    };
    MsgLib.markAdminMessagesRead(adminMessages, userId, isAdmin);
  };

  // ─── User-to-user chat ─────────────────────────────────────────────────────

  /// Send a chat message to another user.
  public shared ({ caller }) func sendChatMessage(recipient : Common.UserId, content : Text) : async Common.MessageId {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    if (Principal.equal(caller, recipient)) { Runtime.trap("Cannot message yourself") };
    if (content.size() == 0) { Runtime.trap("Content cannot be empty") };
    let (msgId, newId) = MsgLib.sendChatMessage(chatMessages, chatMsgIdCounter.at(0), caller, recipient, content);
    chatMsgIdCounter.put(0, newId);
    msgId;
  };

  /// Get the chat history between the caller and another user.
  public shared query ({ caller }) func getChatHistory(otherUserId : Common.UserId) : async [MsgTypes.ChatMessagePublic] {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    MsgLib.getChatHistory(chatMessages, caller, otherUserId);
  };

  /// Get the chat list (all conversations) for the caller with last-message preview.
  public shared query ({ caller }) func getChatList() : async [MsgTypes.ChatPreview] {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    MsgLib.getChatList(chatMessages, users, caller);
  };

  /// Get unread message count in a specific conversation.
  public shared query ({ caller }) func getUnreadCount(otherUserId : Common.UserId) : async Nat {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    MsgLib.getUnreadCount(chatMessages, caller, otherUserId);
  };

  /// Mark all messages from another user in the caller's conversation as read.
  public shared ({ caller }) func markChatMessagesRead(otherUserId : Common.UserId) : async () {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    MsgLib.markChatMessagesRead(chatMessages, caller, otherUserId);
  };
};
