import Common "../types/common";
import Types "../types/messaging";
import UserTypes "../types/users";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  // --- Admin messaging ---

  public func sendMessageToAdmin(
    adminMessages : List.List<Types.AdminMessage>,
    nextId : Nat,
    sender : Common.UserId,
    content : Text,
  ) : (Common.MessageId, Nat) {
    let msg : Types.AdminMessage = {
      id = nextId;
      sender;
      content;
      sentAt = Time.now();
      var isRead = false;
      isAdminReply = false;
    };
    adminMessages.add(msg);
    (nextId, nextId + 1);
  };

  // adminReply stores the message with sender = targetUserId and isAdminReply = true,
  // so it shows up in the target user's thread and is distinguishable as an admin response.
  public func adminReply(
    adminMessages : List.List<Types.AdminMessage>,
    nextId : Nat,
    _adminPrincipal : Common.UserId,
    targetUserId : Common.UserId,
    content : Text,
  ) : (Common.MessageId, Nat) {
    let msg : Types.AdminMessage = {
      id = nextId;
      sender = targetUserId;
      content;
      sentAt = Time.now();
      var isRead = false;
      isAdminReply = true;
    };
    adminMessages.add(msg);
    (nextId, nextId + 1);
  };

  public func getAdminThread(
    adminMessages : List.List<Types.AdminMessage>,
    userId : Common.UserId,
  ) : [Types.AdminMessagePublic] {
    let filtered = adminMessages.filter(func(m) {
      Principal.equal(m.sender, userId)
    });
    let sorted = filtered.sort(func(a, b) = Int.compare(a.sentAt, b.sentAt));
    sorted.map<Types.AdminMessage, Types.AdminMessagePublic>(func(m) {
      {
        id = m.id;
        sender = m.sender;
        content = m.content;
        sentAt = m.sentAt;
        isRead = m.isRead;
        isAdminReply = m.isAdminReply;
      }
    }).toArray();
  };

  public func getAllAdminThreadUsers(
    adminMessages : List.List<Types.AdminMessage>,
  ) : [Common.UserId] {
    let seen = List.empty<Common.UserId>();
    adminMessages.forEach(func(m) {
      if (not m.isAdminReply) {
        switch (seen.find(func(uid) { Principal.equal(uid, m.sender) })) {
          case null { seen.add(m.sender) };
          case (?_) {};
        };
      };
    });
    seen.toArray();
  };

  public func markAdminMessagesRead(
    adminMessages : List.List<Types.AdminMessage>,
    userId : Common.UserId,
    isAdmin : Bool,
  ) {
    // Admin marks user→admin messages (not replies) as read for a given user's thread
    // User marks admin→user reply messages as read for their own thread
    adminMessages.forEach(func(m) {
      if (Principal.equal(m.sender, userId)) {
        if (isAdmin and not m.isAdminReply) {
          m.isRead := true
        } else if (not isAdmin and m.isAdminReply) {
          m.isRead := true
        }
      }
    });
  };

  // --- User-to-user chat ---

  public func makeChatId(a : Common.UserId, b : Common.UserId) : Common.ChatId {
    let ta = a.toText();
    let tb = b.toText();
    if (ta < tb) { ta # ":" # tb } else { tb # ":" # ta };
  };

  public func sendChatMessage(
    chatMessages : List.List<Types.ChatMessage>,
    nextId : Nat,
    sender : Common.UserId,
    recipient : Common.UserId,
    content : Text,
  ) : (Common.MessageId, Nat) {
    let chatId = makeChatId(sender, recipient);
    let msg : Types.ChatMessage = {
      id = nextId;
      chatId;
      sender;
      content;
      sentAt = Time.now();
      var isRead = false;
    };
    chatMessages.add(msg);
    (nextId, nextId + 1);
  };

  public func getChatHistory(
    chatMessages : List.List<Types.ChatMessage>,
    userId : Common.UserId,
    otherUserId : Common.UserId,
  ) : [Types.ChatMessagePublic] {
    let chatId = makeChatId(userId, otherUserId);
    let filtered = chatMessages.filter(func(m) { m.chatId == chatId });
    let sorted = filtered.sort(func(a, b) = Int.compare(a.sentAt, b.sentAt));
    sorted.map<Types.ChatMessage, Types.ChatMessagePublic>(func(m) {
      {
        id = m.id;
        chatId = m.chatId;
        sender = m.sender;
        content = m.content;
        sentAt = m.sentAt;
        isRead = m.isRead;
      }
    }).toArray();
  };

  public func getChatList(
    chatMessages : List.List<Types.ChatMessage>,
    users : List.List<UserTypes.UserProfile>,
    userId : Common.UserId,
    ) : [Types.ChatPreview] {
    let myText = userId.toText();

    // Collect unique chatIds that involve this user
    let chatIds = List.empty<Common.ChatId>();
    chatMessages.forEach(func(m) {
      let parts = m.chatId.split(#char ':').toArray();
      let involved = parts.size() == 2 and (parts[0] == myText or parts[1] == myText);
      if (involved) {
        switch (chatIds.find(func(cid) { cid == m.chatId })) {
          case null { chatIds.add(m.chatId) };
          case (?_) {};
        };
      };
    });

    chatIds.map<Common.ChatId, Types.ChatPreview>(func(chatId) {
      let msgs = chatMessages.filter(func(m) { m.chatId == chatId });
      let sorted = msgs.sort(func(a, b) = Int.compare(a.sentAt, b.sentAt));

      let (lastContent, lastAt) = switch (sorted.last()) {
        case null { ("", 0) };
        case (?m) { (m.content, m.sentAt) };
      };

      let parts = chatId.split(#char ':').toArray();
      let otherText = if (parts.size() == 2 and parts[0] == myText) parts[1] else parts[0];
      let otherUserId = Principal.fromText(otherText);

      let otherUsername = switch (users.find(func(u) { Principal.equal(u.id, otherUserId) })) {
        case (?u) { u.username };
        case null { "Unknown" };
      };

      let unread = msgs.foldLeft(0, func(acc, m) {
        if (not m.isRead and Principal.equal(m.sender, otherUserId)) { acc + 1 }
        else { acc }
      });

      {
        chatId;
        otherUserId;
        otherUsername;
        lastMessage = lastContent;
        lastMessageAt = lastAt;
        unreadCount = unread;
      }
    }).toArray();
  };

  public func getUnreadCount(
    chatMessages : List.List<Types.ChatMessage>,
    userId : Common.UserId,
    otherUserId : Common.UserId,
  ) : Nat {
    let chatId = makeChatId(userId, otherUserId);
    chatMessages.foldLeft<Nat, Types.ChatMessage>(0, func(acc, m) {
      if (m.chatId == chatId and not m.isRead and Principal.equal(m.sender, otherUserId)) {
        acc + 1
      } else { acc }
    });
  };

  public func markChatMessagesRead(
    chatMessages : List.List<Types.ChatMessage>,
    userId : Common.UserId,
    otherUserId : Common.UserId,
  ) {
    let chatId = makeChatId(userId, otherUserId);
    chatMessages.forEach(func(m) {
      if (m.chatId == chatId and Principal.equal(m.sender, otherUserId) and not m.isRead) {
        m.isRead := true
      }
    });
  };
};
