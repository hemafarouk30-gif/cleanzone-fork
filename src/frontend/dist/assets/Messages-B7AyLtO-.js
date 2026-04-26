import { c as createLucideIcon, r as reactExports, t as useDirection, e as useControllableState, j as jsxRuntimeExports, g as Primitive, f as useId, Y as Root, Z as Item, h as composeEventHandlers, P as Presence, _ as createRovingFocusGroupScope, m as createContextScope, s as cn, $ as MessageSquare, u as useActor, b as useQuery, V as useAuth, H as useQueryClient, Q as Avatar, U as AvatarFallback, S as Skeleton, I as Button, X as Input, d as createActor } from "./index-Ds37swa0.js";
import { B as Badge } from "./badge-Be4APrJW.js";
import { T as Textarea } from "./textarea-1ULo2F4d.js";
import { u as useMutation, a as ue } from "./index-Coer_joW.js";
import { L as Lock } from "./lock-DoS7YRJb.js";
import { X } from "./x-B4yMahrI.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
function timeLabel(ts) {
  const d = new Date(Number(ts) / 1e6);
  const now = /* @__PURE__ */ new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function initials(name) {
  return name.slice(0, 2).toUpperCase();
}
const sentBubble = {
  background: "oklch(var(--accent) / 0.85)",
  color: "oklch(var(--accent-foreground))",
  borderBottom: "2px solid oklch(var(--accent))"
};
const recvBubble = {
  background: "oklch(var(--card))",
  border: "2px solid oklch(var(--border))"
};
function ComposeInput({
  value,
  onChange,
  onSend,
  disabled,
  ocidPrefix
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex gap-2 pt-3 mt-2 border-t",
      style: { borderColor: "oklch(var(--border))" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value,
            onChange: (e) => onChange(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            },
            placeholder: "Type your message…",
            className: "resize-none min-h-[44px] max-h-24 border-2 font-body text-sm",
            style: { borderColor: "oklch(var(--primary))" },
            "data-ocid": `${ocidPrefix}.input`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            onClick: onSend,
            disabled,
            className: "h-11 w-11 shrink-0 p-0 border-0",
            style: {
              background: "oklch(var(--accent))",
              color: "oklch(var(--accent-foreground))"
            },
            "data-ocid": `${ocidPrefix}.send_button`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
          }
        )
      ]
    }
  );
}
function AdminThread() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [msg, setMsg] = reactExports.useState("");
  const bottomRef = reactExports.useRef(null);
  const { data: thread, isLoading } = useQuery({
    queryKey: ["adminThread"],
    queryFn: async () => {
      if (!actor) return [];
      const msgs = await actor.getMyAdminThread();
      return msgs;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5e3
  });
  reactExports.useEffect(() => {
    if (((thread == null ? void 0 : thread.length) ?? 0) > 0) {
      setTimeout(
        () => {
          var _a;
          return (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
        },
        50
      );
    }
  }, [thread == null ? void 0 : thread.length]);
  const sendMutation = useMutation({
    mutationFn: async (content) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendMessageToAdmin(content);
    },
    onSuccess: () => {
      setMsg("");
      queryClient.invalidateQueries({ queryKey: ["adminThread"] });
    },
    onError: () => ue.error("Failed to send message.")
  });
  const handleSend = () => {
    if (!msg.trim()) return;
    sendMutation.mutate(msg.trim());
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 min-h-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 px-4 py-2.5 rounded-lg mb-3 shrink-0",
        style: {
          background: "oklch(var(--primary) / 0.1)",
          border: "1px solid oklch(var(--primary))"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Lock,
            {
              className: "w-3.5 h-3.5 shrink-0",
              style: { color: "oklch(var(--primary))" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-foreground", children: "Direct line to CleanZone admin team" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto flex flex-col gap-3 pr-1 min-h-0", children: [
      isLoading ? ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-3/4 rounded-xl" }, k)) : !thread || thread.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-3 py-12 rounded-xl mt-4",
          style: { border: "2px dashed oklch(var(--border))" },
          "data-ocid": "messages.admin_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-8 h-8 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground text-center", children: "No messages yet. Ask the admin anything!" })
          ]
        }
      ) : thread.map((m) => {
        const isMine = !m.isAdminReply;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "flex gap-2",
              isMine ? "justify-end" : "justify-start"
            ),
            children: [
              !isMine && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Avatar,
                {
                  className: "w-7 h-7 shrink-0 mt-1",
                  style: { border: "2px solid oklch(var(--primary))" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AvatarFallback,
                    {
                      className: "text-[9px] font-mono font-bold",
                      style: {
                        background: "oklch(var(--primary) / 0.15)",
                        color: "oklch(var(--primary))"
                      },
                      children: "ADM"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: cn(
                    "max-w-[75%] px-4 py-2.5 rounded-2xl flex flex-col gap-1",
                    isMine ? "rounded-tr-sm" : "rounded-tl-sm"
                  ),
                  style: isMine ? sentBubble : recvBubble,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm leading-relaxed break-words", children: m.content }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 self-end", children: [
                      !m.isRead && !m.isAdminReply && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "w-1.5 h-1.5 rounded-full shrink-0",
                          style: { background: "oklch(var(--accent))" },
                          "aria-label": "Unread"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono opacity-70", children: timeLabel(m.sentAt) })
                    ] })
                  ]
                }
              )
            ]
          },
          String(m.id)
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ComposeInput,
      {
        value: msg,
        onChange: setMsg,
        onSend: handleSend,
        disabled: !msg.trim() || sendMutation.isPending,
        ocidPrefix: "messages.admin"
      }
    )
  ] });
}
function ChatThread({
  preview,
  onBack
}) {
  const { actor, isFetching } = useActor(createActor);
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [msg, setMsg] = reactExports.useState("");
  const bottomRef = reactExports.useRef(null);
  const { data: messages, isLoading } = useQuery({
    queryKey: ["chatHistory", preview.chatId],
    queryFn: async () => {
      if (!actor) return [];
      const msgs = await actor.getChatHistory(preview.otherUserId);
      actor.markChatMessagesRead(preview.otherUserId).catch(() => {
      });
      return msgs;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5e3
  });
  reactExports.useEffect(() => {
    if (((messages == null ? void 0 : messages.length) ?? 0) > 0) {
      setTimeout(
        () => {
          var _a;
          return (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
        },
        50
      );
    }
  }, [messages == null ? void 0 : messages.length]);
  const sendMutation = useMutation({
    mutationFn: async (content) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendChatMessage(preview.otherUserId, content);
    },
    onSuccess: () => {
      setMsg("");
      queryClient.invalidateQueries({
        queryKey: ["chatHistory", preview.chatId]
      });
      queryClient.invalidateQueries({ queryKey: ["chatList"] });
    },
    onError: () => ue.error("Failed to send.")
  });
  const handleSend = () => {
    if (!msg.trim()) return;
    sendMutation.mutate(msg.trim());
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 min-h-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 pb-3 border-b mb-3 shrink-0",
        style: { borderColor: "oklch(var(--border))" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onBack,
              className: "p-1.5 rounded-lg transition-smooth hover:bg-muted/50",
              "data-ocid": "messages.back_button",
              "aria-label": "Back to conversations",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Avatar,
            {
              className: "w-8 h-8 shrink-0",
              style: { border: "2px solid oklch(var(--primary))" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                AvatarFallback,
                {
                  className: "text-xs font-mono font-bold",
                  style: {
                    background: "oklch(var(--primary) / 0.1)",
                    color: "oklch(var(--primary))"
                  },
                  children: initials(preview.otherUsername)
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm truncate", children: preview.otherUsername }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto flex flex-col gap-3 pr-1 min-h-0", children: [
      isLoading ? ["a", "b"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-2/3 rounded-xl" }, k)) : !messages || messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-2 py-10",
          "data-ocid": "messages.chat_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-7 h-7 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-muted-foreground", children: "No messages yet. Say hello!" })
          ]
        }
      ) : messages.map((m) => {
        const isMine = !!profile && m.sender.toString() === profile.id.toString();
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn("flex", isMine ? "justify-end" : "justify-start"),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "max-w-[75%] px-4 py-2.5 rounded-2xl flex flex-col gap-1",
                  isMine ? "rounded-tr-sm" : "rounded-tl-sm"
                ),
                style: isMine ? sentBubble : recvBubble,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm leading-relaxed break-words", children: m.content }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono opacity-70 self-end", children: timeLabel(m.sentAt) })
                ]
              }
            )
          },
          String(m.id)
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ComposeInput,
      {
        value: msg,
        onChange: setMsg,
        onSend: handleSend,
        disabled: !msg.trim() || sendMutation.isPending,
        ocidPrefix: "messages.chat"
      }
    )
  ] });
}
function NewChatPanel({
  onStartChat,
  onClose
}) {
  const { actor, isFetching } = useActor(createActor);
  const [query, setQuery] = reactExports.useState("");
  const [searching, setSearching] = reactExports.useState(false);
  const [sendingTo, setSendingTo] = reactExports.useState(null);
  const [msg, setMsg] = reactExports.useState("");
  const queryClient = useQueryClient();
  const { data: chatList } = useQuery({
    queryKey: ["chatList"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatList();
    },
    enabled: !!actor && !isFetching
  });
  const [found, setFound] = reactExports.useState(null);
  const [notFound, setNotFound] = reactExports.useState(false);
  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    setNotFound(false);
    setFound(null);
    const match = chatList == null ? void 0 : chatList.find(
      (c) => c.otherUsername.toLowerCase() === query.trim().toLowerCase()
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
      content
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendChatMessage(userId, content);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["chatList"] });
      const preview = {
        chatId: `new-${userId.toString()}`,
        otherUserId: userId,
        otherUsername: sendingTo ?? query.trim(),
        lastMessage: msg,
        lastMessageAt: BigInt(Date.now()) * BigInt(1e6),
        unreadCount: BigInt(0)
      };
      onStartChat(preview);
    },
    onError: () => ue.error("Couldn't start conversation.")
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-4 p-4 rounded-xl",
      style: {
        background: "oklch(var(--card))",
        border: "2px solid oklch(var(--primary))"
      },
      "data-ocid": "messages.new_chat_panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm uppercase tracking-widest", children: "Start New Chat" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "p-1 rounded-lg transition-smooth hover:bg-muted/50",
              "data-ocid": "messages.new_chat_close_button",
              "aria-label": "Close",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: query,
              onChange: (e) => {
                setQuery(e.target.value);
                setFound(null);
                setNotFound(false);
              },
              onKeyDown: (e) => e.key === "Enter" && handleSearch(),
              placeholder: "Search by username…",
              className: "font-mono text-sm border-2",
              style: { borderColor: "oklch(var(--border))" },
              "data-ocid": "messages.new_chat_search_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleSearch,
              disabled: !query.trim() || searching,
              className: "shrink-0 px-3 border-0",
              style: {
                background: "oklch(var(--primary) / 0.15)",
                color: "oklch(var(--primary))"
              },
              "data-ocid": "messages.new_chat_search_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4" })
            }
          )
        ] }),
        notFound && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs font-mono text-muted-foreground",
            "data-ocid": "messages.new_chat_not_found",
            children: "No user found with that username in your contact list."
          }
        ),
        found && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3 px-3 py-2.5 rounded-lg",
              style: {
                background: "oklch(var(--background))",
                border: "1px solid oklch(var(--border))"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Avatar,
                  {
                    className: "w-8 h-8 shrink-0",
                    style: { border: "2px solid oklch(var(--primary))" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      AvatarFallback,
                      {
                        className: "text-xs font-mono font-bold",
                        style: {
                          background: "oklch(var(--primary) / 0.1)",
                          color: "oklch(var(--primary))"
                        },
                        children: initials(found.otherUsername)
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm flex-1 min-w-0 truncate", children: found.otherUsername }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    onClick: handleStartFromFound,
                    className: "text-xs font-mono border-0",
                    style: {
                      background: "oklch(var(--accent))",
                      color: "oklch(var(--accent-foreground))"
                    },
                    "data-ocid": "messages.new_chat_open_button",
                    children: "Open Chat"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: msg,
                onChange: (e) => setMsg(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && handleStartNew(),
                placeholder: "Send a first message…",
                className: "font-body text-sm border-2",
                style: { borderColor: "oklch(var(--border))" },
                "data-ocid": "messages.new_chat_message_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: handleStartNew,
                disabled: !msg.trim() || startMutation.isPending,
                className: "shrink-0 px-3 border-0",
                style: {
                  background: "oklch(var(--accent))",
                  color: "oklch(var(--accent-foreground))"
                },
                "data-ocid": "messages.new_chat_send_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ChatList({
  onSelectChat
}) {
  const { actor, isFetching } = useActor(createActor);
  const [showNewChat, setShowNewChat] = reactExports.useState(false);
  const { data: chatList, isLoading } = useQuery({
    queryKey: ["chatList"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatList();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 8e3
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "outline",
        className: "w-full flex items-center gap-2 font-mono text-xs uppercase tracking-widest border-2 transition-smooth",
        style: {
          borderColor: showNewChat ? "oklch(var(--accent))" : "oklch(var(--border))",
          color: showNewChat ? "oklch(var(--accent))" : "oklch(var(--foreground))"
        },
        onClick: () => setShowNewChat((v) => !v),
        "data-ocid": "messages.new_chat_toggle",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-3.5 h-3.5" }),
          showNewChat ? "Cancel" : "New Conversation"
        ]
      }
    ),
    showNewChat && /* @__PURE__ */ jsxRuntimeExports.jsx(
      NewChatPanel,
      {
        onStartChat: (p) => {
          setShowNewChat(false);
          onSelectChat(p);
        },
        onClose: () => setShowNewChat(false)
      }
    ),
    isLoading ? ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" }, k)) : !chatList || chatList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-3 py-12 rounded-xl",
        style: { border: "2px dashed oklch(var(--border))" },
        "data-ocid": "messages.users_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-8 h-8 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground text-center px-4", children: "No conversations yet. Start one above!" })
        ]
      }
    ) : chatList.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onSelectChat(c),
        className: "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-smooth hover:shadow-steel w-full card-industrial",
        "data-ocid": `messages.chat_item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Avatar,
            {
              className: "w-10 h-10 shrink-0",
              style: { border: "2px solid oklch(var(--primary))" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                AvatarFallback,
                {
                  className: "text-xs font-mono font-bold",
                  style: {
                    background: "oklch(var(--primary) / 0.1)",
                    color: "oklch(var(--primary))"
                  },
                  children: initials(c.otherUsername)
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm truncate", children: c.otherUsername }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
                Number(c.unreadCount) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: "text-[9px] font-mono font-bold px-1.5 py-0 h-4 border-0",
                    style: {
                      background: "oklch(var(--accent))",
                      color: "oklch(var(--accent-foreground))"
                    },
                    "data-ocid": `messages.unread_badge.${i + 1}`,
                    children: Number(c.unreadCount)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-muted-foreground", children: timeLabel(c.lastMessageAt) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground truncate mt-0.5", children: c.lastMessage })
          ] })
        ]
      },
      c.chatId
    ))
  ] });
}
function useAdminUnreadCount() {
  const { actor, isFetching } = useActor(createActor);
  const { data: thread } = useQuery({
    queryKey: ["adminThread"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyAdminThread();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 1e4
  });
  return (thread == null ? void 0 : thread.filter((m) => m.isAdminReply && !m.isRead).length) ?? 0;
}
function useChatsUnreadCount() {
  const { actor, isFetching } = useActor(createActor);
  const { data: chatList } = useQuery({
    queryKey: ["chatList"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatList();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 1e4
  });
  return (chatList == null ? void 0 : chatList.reduce((acc, c) => acc + Number(c.unreadCount), 0)) ?? 0;
}
function Messages() {
  const [activeChat, setActiveChat] = reactExports.useState(null);
  const [tab, setTab] = reactExports.useState("admin");
  const adminUnread = useAdminUnreadCount();
  const chatsUnread = useChatsUnreadCount();
  if (activeChat) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col flex-1 min-h-0 px-4 py-5 pb-24 md:pb-5 max-w-2xl mx-auto w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChatThread, { preview: activeChat, onBack: () => setActiveChat(null) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 px-4 py-5 pb-24 md:pb-5 max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-10 h-10 flex items-center justify-center rounded-xl shrink-0",
          style: {
            background: "oklch(var(--primary) / 0.1)",
            border: "2px solid oklch(var(--primary))"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            MessageSquare,
            {
              className: "w-5 h-5",
              style: { color: "oklch(var(--primary))" }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl uppercase tracking-widest", children: "Messages" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-muted-foreground", children: "Civic communications" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: setTab, "data-ocid": "messages.tabs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TabsList,
        {
          className: "w-full rounded-lg p-1 h-10",
          style: {
            background: "oklch(var(--muted))",
            border: "2px solid oklch(var(--border))"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "admin",
                className: "flex-1 font-mono text-xs uppercase tracking-widest relative",
                "data-ocid": "messages.admin_tab",
                children: [
                  "Admin",
                  adminUnread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center",
                      style: {
                        background: "oklch(var(--accent))",
                        color: "oklch(var(--accent-foreground))"
                      },
                      children: adminUnread
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "chats",
                className: "flex-1 font-mono text-xs uppercase tracking-widest relative",
                "data-ocid": "messages.chats_tab",
                children: [
                  "Chats",
                  chatsUnread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center",
                      style: {
                        background: "oklch(var(--accent))",
                        color: "oklch(var(--accent-foreground))"
                      },
                      children: chatsUnread
                    }
                  )
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "admin", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminThread, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "chats", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChatList, { onSelectChat: setActiveChat }) })
    ] })
  ] });
}
export {
  Messages as default
};
