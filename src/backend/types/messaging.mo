import Common "common";

module {
  public type AdminMessage = {
    id : Common.MessageId;
    sender : Common.UserId;
    content : Text;
    sentAt : Common.Timestamp;
    var isRead : Bool;
    isAdminReply : Bool;
  };

  // Shared (immutable) version for API boundary
  public type AdminMessagePublic = {
    id : Common.MessageId;
    sender : Common.UserId;
    content : Text;
    sentAt : Common.Timestamp;
    isRead : Bool;
    isAdminReply : Bool;
  };

  public type ChatMessage = {
    id : Common.MessageId;
    chatId : Common.ChatId;
    sender : Common.UserId;
    content : Text;
    sentAt : Common.Timestamp;
    var isRead : Bool;
  };

  // Shared (immutable) version for API boundary
  public type ChatMessagePublic = {
    id : Common.MessageId;
    chatId : Common.ChatId;
    sender : Common.UserId;
    content : Text;
    sentAt : Common.Timestamp;
    isRead : Bool;
  };

  public type ChatPreview = {
    chatId : Common.ChatId;
    otherUserId : Common.UserId;
    otherUsername : Text;
    lastMessage : Text;
    lastMessageAt : Common.Timestamp;
    unreadCount : Nat;
  };
};
