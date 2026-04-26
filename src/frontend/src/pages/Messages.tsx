import { createActor } from "@/backend";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type {
  AdminMessagePublic,
  ChatMessagePublic,
  ChatPreview,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  Lock,
  MessageSquare,
  PlusCircle,
  Search,
  Send,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeLabel(ts: bigint) {
  const d = new Date(Number(ts) / 1_000_000);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

const sentBubble: React.CSSProperties = {
  background: "oklch(var(--accent) / 0.85)",
  color: "oklch(var(--accent-foreground))",
  borderBottom: "2px solid oklch(var(--accent))",
};

const recvBubble: React.CSSProperties = {
  background: "oklch(var(--card))",
  border: "2px solid oklch(var(--border))",
};

// ─── Message Input Row ────────────────────────────────────────────────────────

function ComposeInput({
  value,
  onChange,
  onSend,
  disabled,
  ocidPrefix,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
  ocidPrefix: string;
}) {
  return (
    <div
      className="flex gap-2 pt-3 mt-2 border-t"
      style={{ borderColor: "oklch(var(--border))" }}
    >
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder="Type your message…"
        className="resize-none min-h-[44px] max-h-24 border-2 font-body text-sm"
        style={{ borderColor: "oklch(var(--primary))" }}
        data-ocid={`${ocidPrefix}.input`}
      />
      <Button
        type="button"
        onClick={onSend}
        disabled={disabled}
        className="h-11 w-11 shrink-0 p-0 border-0"
        style={{
          background: "oklch(var(--accent))",
          color: "oklch(var(--accent-foreground))",
        }}
        data-ocid={`${ocidPrefix}.send_button`}
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}

// ─── Admin Thread ─────────────────────────────────────────────────────────────

function AdminThread() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [msg, setMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: thread, isLoading } = useQuery<AdminMessagePublic[]>({
    queryKey: ["adminThread"],
    queryFn: async () => {
      if (!actor) return [];
      const msgs = await actor.getMyAdminThread();
      return msgs;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });

  // Auto-scroll on new messages
  useEffect(() => {
    if ((thread?.length ?? 0) > 0) {
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    }
  }, [thread?.length]);

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendMessageToAdmin(content);
    },
    onSuccess: () => {
      setMsg("");
      queryClient.invalidateQueries({ queryKey: ["adminThread"] });
    },
    onError: () => toast.error("Failed to send message."),
  });

  const handleSend = () => {
    if (!msg.trim()) return;
    sendMutation.mutate(msg.trim());
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Info banner */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg mb-3 shrink-0"
        style={{
          background: "oklch(var(--primary) / 0.1)",
          border: "1px solid oklch(var(--primary))",
        }}
      >
        <Lock
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: "oklch(var(--primary))" }}
        />
        <p className="text-xs font-mono text-foreground">
          Direct line to CleanZone admin team
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 min-h-0">
        {isLoading ? (
          ["a", "b", "c"].map((k) => (
            <Skeleton key={k} className="h-14 w-3/4 rounded-xl" />
          ))
        ) : !thread || thread.length === 0 ? (
          <div
            className="flex flex-col items-center gap-3 py-12 rounded-xl mt-4"
            style={{ border: "2px dashed oklch(var(--border))" }}
            data-ocid="messages.admin_empty_state"
          >
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
            <p className="font-body text-sm text-muted-foreground text-center">
              No messages yet. Ask the admin anything!
            </p>
          </div>
        ) : (
          thread.map((m) => {
            const isMine = !m.isAdminReply;
            return (
              <div
                key={String(m.id)}
                className={cn(
                  "flex gap-2",
                  isMine ? "justify-end" : "justify-start",
                )}
              >
                {!isMine && (
                  <Avatar
                    className="w-7 h-7 shrink-0 mt-1"
                    style={{ border: "2px solid oklch(var(--primary))" }}
                  >
                    <AvatarFallback
                      className="text-[9px] font-mono font-bold"
                      style={{
                        background: "oklch(var(--primary) / 0.15)",
                        color: "oklch(var(--primary))",
                      }}
                    >
                      ADM
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[75%] px-4 py-2.5 rounded-2xl flex flex-col gap-1",
                    isMine ? "rounded-tr-sm" : "rounded-tl-sm",
                  )}
                  style={isMine ? sentBubble : recvBubble}
                >
                  <p className="font-body text-sm leading-relaxed break-words">
                    {m.content}
                  </p>
                  <div className="flex items-center gap-1.5 self-end">
                    {!m.isRead && !m.isAdminReply && (
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: "oklch(var(--accent))" }}
                        aria-label="Unread"
                      />
                    )}
                    <span className="text-[9px] font-mono opacity-70">
                      {timeLabel(m.sentAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <ComposeInput
        value={msg}
        onChange={setMsg}
        onSend={handleSend}
        disabled={!msg.trim() || sendMutation.isPending}
        ocidPrefix="messages.admin"
      />
    </div>
  );
}

// ─── Chat Thread ──────────────────────────────────────────────────────────────

function ChatThread({
  preview,
  onBack,
}: { preview: ChatPreview; onBack: () => void }) {
  const { actor, isFetching } = useActor(createActor);
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [msg, setMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery<ChatMessagePublic[]>({
    queryKey: ["chatHistory", preview.chatId],
    queryFn: async () => {
      if (!actor) return [];
      const msgs = await actor.getChatHistory(preview.otherUserId);
      // Mark as read
      actor.markChatMessagesRead(preview.otherUserId).catch(() => {});
      return msgs;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if ((messages?.length ?? 0) > 0) {
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    }
  }, [messages?.length]);

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendChatMessage(preview.otherUserId, content);
    },
    onSuccess: () => {
      setMsg("");
      queryClient.invalidateQueries({
        queryKey: ["chatHistory", preview.chatId],
      });
      queryClient.invalidateQueries({ queryKey: ["chatList"] });
    },
    onError: () => toast.error("Failed to send."),
  });

  const handleSend = () => {
    if (!msg.trim()) return;
    sendMutation.mutate(msg.trim());
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Back header */}
      <div
        className="flex items-center gap-3 pb-3 border-b mb-3 shrink-0"
        style={{ borderColor: "oklch(var(--border))" }}
      >
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-lg transition-smooth hover:bg-muted/50"
          data-ocid="messages.back_button"
          aria-label="Back to conversations"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <Avatar
          className="w-8 h-8 shrink-0"
          style={{ border: "2px solid oklch(var(--primary))" }}
        >
          <AvatarFallback
            className="text-xs font-mono font-bold"
            style={{
              background: "oklch(var(--primary) / 0.1)",
              color: "oklch(var(--primary))",
            }}
          >
            {initials(preview.otherUsername)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-sm truncate">
            {preview.otherUsername}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 min-h-0">
        {isLoading ? (
          ["a", "b"].map((k) => (
            <Skeleton key={k} className="h-10 w-2/3 rounded-xl" />
          ))
        ) : !messages || messages.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-10"
            data-ocid="messages.chat_empty_state"
          >
            <MessageSquare className="w-7 h-7 text-muted-foreground" />
            <p className="text-sm font-body text-muted-foreground">
              No messages yet. Say hello!
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isMine =
              !!profile && m.sender.toString() === profile.id.toString();
            return (
              <div
                key={String(m.id)}
                className={cn("flex", isMine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[75%] px-4 py-2.5 rounded-2xl flex flex-col gap-1",
                    isMine ? "rounded-tr-sm" : "rounded-tl-sm",
                  )}
                  style={isMine ? sentBubble : recvBubble}
                >
                  <p className="font-body text-sm leading-relaxed break-words">
                    {m.content}
                  </p>
                  <span className="text-[9px] font-mono opacity-70 self-end">
                    {timeLabel(m.sentAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <ComposeInput
        value={msg}
        onChange={setMsg}
        onSend={handleSend}
        disabled={!msg.trim() || sendMutation.isPending}
        ocidPrefix="messages.chat"
      />
    </div>
  );
}

// ─── New Chat Modal ───────────────────────────────────────────────────────────

function NewChatPanel({
  onStartChat,
  onClose,
}: {
  onStartChat: (preview: ChatPreview) => void;
  onClose: () => void;
}) {
  const { actor, isFetching } = useActor(createActor);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const queryClient = useQueryClient();

  // Simulate search by fetching known user from chat list and leaderboard
  const { data: chatList } = useQuery<ChatPreview[]>({
    queryKey: ["chatList"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatList();
    },
    enabled: !!actor && !isFetching,
  });

  const [found, setFound] = useState<ChatPreview | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    setNotFound(false);
    setFound(null);
    // Search in existing chat list first
    const match = chatList?.find(
      (c) => c.otherUsername.toLowerCase() === query.trim().toLowerCase(),
    );
    if (match) {
      setFound(match);
    } else {
      setNotFound(true);
    }
    setSearching(false);
  };

  const startMutation = useMutation({
    mutationFn: async ({
      userId,
      content,
    }: { userId: import("@/types").Principal; content: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendChatMessage(userId, content);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["chatList"] });
      // Build preview-like object to open thread
      const preview: ChatPreview = {
        chatId: `new-${userId.toString()}`,
        otherUserId: userId,
        otherUsername: sendingTo ?? query.trim(),
        lastMessage: msg,
        lastMessageAt: BigInt(Date.now()) * BigInt(1_000_000),
        unreadCount: BigInt(0),
      };
      onStartChat(preview);
    },
    onError: () => toast.error("Couldn't start conversation."),
  });

  const handleStartFromFound = () => {
    if (!found) return;
    onStartChat(found);
  };

  const handleStartNew = () => {
    if (!msg.trim() || !found) return;
    setSendingTo(found.otherUsername);
    startMutation.mutate({ userId: found.otherUserId, content: msg.trim() });
  };

  return (
    <div
      className="flex flex-col gap-4 p-4 rounded-xl"
      style={{
        background: "oklch(var(--card))",
        border: "2px solid oklch(var(--primary))",
      }}
      data-ocid="messages.new_chat_panel"
    >
      <div className="flex items-center justify-between">
        <p className="font-display font-bold text-sm uppercase tracking-widest">
          Start New Chat
        </p>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg transition-smooth hover:bg-muted/50"
          data-ocid="messages.new_chat_close_button"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search bar */}
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setFound(null);
            setNotFound(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search by username…"
          className="font-mono text-sm border-2"
          style={{ borderColor: "oklch(var(--border))" }}
          data-ocid="messages.new_chat_search_input"
        />
        <Button
          type="button"
          onClick={handleSearch}
          disabled={!query.trim() || searching}
          className="shrink-0 px-3 border-0"
          style={{
            background: "oklch(var(--primary) / 0.15)",
            color: "oklch(var(--primary))",
          }}
          data-ocid="messages.new_chat_search_button"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Result */}
      {notFound && (
        <p
          className="text-xs font-mono text-muted-foreground"
          data-ocid="messages.new_chat_not_found"
        >
          No user found with that username in your contact list.
        </p>
      )}

      {found && (
        <div className="flex flex-col gap-3">
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{
              background: "oklch(var(--background))",
              border: "1px solid oklch(var(--border))",
            }}
          >
            <Avatar
              className="w-8 h-8 shrink-0"
              style={{ border: "2px solid oklch(var(--primary))" }}
            >
              <AvatarFallback
                className="text-xs font-mono font-bold"
                style={{
                  background: "oklch(var(--primary) / 0.1)",
                  color: "oklch(var(--primary))",
                }}
              >
                {initials(found.otherUsername)}
              </AvatarFallback>
            </Avatar>
            <p className="font-display font-semibold text-sm flex-1 min-w-0 truncate">
              {found.otherUsername}
            </p>
            <Button
              type="button"
              size="sm"
              onClick={handleStartFromFound}
              className="text-xs font-mono border-0"
              style={{
                background: "oklch(var(--accent))",
                color: "oklch(var(--accent-foreground))",
              }}
              data-ocid="messages.new_chat_open_button"
            >
              Open Chat
            </Button>
          </div>

          {/* Or send first message */}
          <div className="flex gap-2">
            <Input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStartNew()}
              placeholder="Send a first message…"
              className="font-body text-sm border-2"
              style={{ borderColor: "oklch(var(--border))" }}
              data-ocid="messages.new_chat_message_input"
            />
            <Button
              type="button"
              onClick={handleStartNew}
              disabled={!msg.trim() || startMutation.isPending}
              className="shrink-0 px-3 border-0"
              style={{
                background: "oklch(var(--accent))",
                color: "oklch(var(--accent-foreground))",
              }}
              data-ocid="messages.new_chat_send_button"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Chat List ────────────────────────────────────────────────────────────────

function ChatList({
  onSelectChat,
}: { onSelectChat: (preview: ChatPreview) => void }) {
  const { actor, isFetching } = useActor(createActor);
  const [showNewChat, setShowNewChat] = useState(false);

  const { data: chatList, isLoading } = useQuery<ChatPreview[]>({
    queryKey: ["chatList"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatList();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 8000,
  });

  return (
    <div className="flex flex-col gap-3">
      {/* New chat toggle */}
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center gap-2 font-mono text-xs uppercase tracking-widest border-2 transition-smooth"
        style={{
          borderColor: showNewChat
            ? "oklch(var(--accent))"
            : "oklch(var(--border))",
          color: showNewChat
            ? "oklch(var(--accent))"
            : "oklch(var(--foreground))",
        }}
        onClick={() => setShowNewChat((v) => !v)}
        data-ocid="messages.new_chat_toggle"
      >
        <PlusCircle className="w-3.5 h-3.5" />
        {showNewChat ? "Cancel" : "New Conversation"}
      </Button>

      {showNewChat && (
        <NewChatPanel
          onStartChat={(p) => {
            setShowNewChat(false);
            onSelectChat(p);
          }}
          onClose={() => setShowNewChat(false)}
        />
      )}

      {/* List */}
      {isLoading ? (
        ["a", "b", "c"].map((k) => (
          <Skeleton key={k} className="h-16 w-full rounded-xl" />
        ))
      ) : !chatList || chatList.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 py-12 rounded-xl"
          style={{ border: "2px dashed oklch(var(--border))" }}
          data-ocid="messages.users_empty_state"
        >
          <MessageSquare className="w-8 h-8 text-muted-foreground" />
          <p className="font-body text-sm text-muted-foreground text-center px-4">
            No conversations yet. Start one above!
          </p>
        </div>
      ) : (
        chatList.map((c, i) => (
          <button
            type="button"
            key={c.chatId}
            onClick={() => onSelectChat(c)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-smooth hover:shadow-steel w-full card-industrial"
            data-ocid={`messages.chat_item.${i + 1}`}
          >
            <Avatar
              className="w-10 h-10 shrink-0"
              style={{ border: "2px solid oklch(var(--primary))" }}
            >
              <AvatarFallback
                className="text-xs font-mono font-bold"
                style={{
                  background: "oklch(var(--primary) / 0.1)",
                  color: "oklch(var(--primary))",
                }}
              >
                {initials(c.otherUsername)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display font-semibold text-sm truncate">
                  {c.otherUsername}
                </p>
                <div className="flex items-center gap-1.5 shrink-0">
                  {Number(c.unreadCount) > 0 && (
                    <Badge
                      className="text-[9px] font-mono font-bold px-1.5 py-0 h-4 border-0"
                      style={{
                        background: "oklch(var(--accent))",
                        color: "oklch(var(--accent-foreground))",
                      }}
                      data-ocid={`messages.unread_badge.${i + 1}`}
                    >
                      {Number(c.unreadCount)}
                    </Badge>
                  )}
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {timeLabel(c.lastMessageAt)}
                  </span>
                </div>
              </div>
              <p className="text-xs font-body text-muted-foreground truncate mt-0.5">
                {c.lastMessage}
              </p>
            </div>
          </button>
        ))
      )}
    </div>
  );
}

// ─── Unread admin count ───────────────────────────────────────────────────────

function useAdminUnreadCount() {
  const { actor, isFetching } = useActor(createActor);
  const { data: thread } = useQuery<AdminMessagePublic[]>({
    queryKey: ["adminThread"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyAdminThread();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
  return thread?.filter((m) => m.isAdminReply && !m.isRead).length ?? 0;
}

function useChatsUnreadCount() {
  const { actor, isFetching } = useActor(createActor);
  const { data: chatList } = useQuery<ChatPreview[]>({
    queryKey: ["chatList"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatList();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
  return chatList?.reduce((acc, c) => acc + Number(c.unreadCount), 0) ?? 0;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Messages() {
  const [activeChat, setActiveChat] = useState<ChatPreview | null>(null);
  const [tab, setTab] = useState("admin");
  const adminUnread = useAdminUnreadCount();
  const chatsUnread = useChatsUnreadCount();

  if (activeChat) {
    return (
      <div className="flex flex-col flex-1 min-h-0 px-4 py-5 pb-24 md:pb-5 max-w-2xl mx-auto w-full">
        <ChatThread preview={activeChat} onBack={() => setActiveChat(null)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-5 pb-24 md:pb-5 max-w-2xl mx-auto">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0"
          style={{
            background: "oklch(var(--primary) / 0.1)",
            border: "2px solid oklch(var(--primary))",
          }}
        >
          <MessageSquare
            className="w-5 h-5"
            style={{ color: "oklch(var(--primary))" }}
          />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl uppercase tracking-widest">
            Messages
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Civic communications
          </p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} data-ocid="messages.tabs">
        <TabsList
          className="w-full rounded-lg p-1 h-10"
          style={{
            background: "oklch(var(--muted))",
            border: "2px solid oklch(var(--border))",
          }}
        >
          <TabsTrigger
            value="admin"
            className="flex-1 font-mono text-xs uppercase tracking-widest relative"
            data-ocid="messages.admin_tab"
          >
            Admin
            {adminUnread > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center"
                style={{
                  background: "oklch(var(--accent))",
                  color: "oklch(var(--accent-foreground))",
                }}
              >
                {adminUnread}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="chats"
            className="flex-1 font-mono text-xs uppercase tracking-widest relative"
            data-ocid="messages.chats_tab"
          >
            Chats
            {chatsUnread > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center"
                style={{
                  background: "oklch(var(--accent))",
                  color: "oklch(var(--accent-foreground))",
                }}
              >
                {chatsUnread}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="mt-4">
          <AdminThread />
        </TabsContent>

        <TabsContent value="chats" className="mt-4">
          <ChatList onSelectChat={setActiveChat} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
