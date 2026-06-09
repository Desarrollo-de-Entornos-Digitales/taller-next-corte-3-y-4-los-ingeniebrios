"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  getConversationAction,
  sendMessageAction,
  MessageResponse,
  FriendUser,
} from "../actions/chat.action";

type User = { id: number; name: string; avatar: string | null };

// Props interface for ChatClient
type Props = {
  me: User;
  receiver: User;
  initialMessages: MessageResponse[];
  allMessages: MessageResponse[];
  friends: FriendUser[];
  monitors: any[];
  students: any[];
  isMonitor: boolean;
};

// Helper function for avatar URL
function getAvatar(avatar: string | null | undefined, name: string) {
  if (avatar && avatar.startsWith("data:")) return avatar;
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}`;
}

// Format time with date and time
function formatTime(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
      timeZone: "America/Bogota",
    }).format(new Date(dateStr));
  } catch { return dateStr; }
}

// Format time to HH:MM only
function formatTimeShort(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      hour: "2-digit", minute: "2-digit", timeZone: "America/Bogota",
    }).format(new Date(dateStr));
  } catch { return dateStr; }
}

// Build conversations from messages
function buildConversations(allMessages: MessageResponse[], myId: number) {
  const map = new Map<number, { user: User; lastMessage: MessageResponse }>();
  for (const msg of allMessages) {
    const other = msg.sender.id === myId ? msg.receiver : msg.sender;
    const existing = map.get(other.id);
    if (!existing || new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
      map.set(other.id, { user: other, lastMessage: msg });
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );
}

type Tab = "chats" | "amigos" | "estudiantes" | "monitores";

// Chat Client component - manages individual conversation
export default function ChatClient({ me, receiver, initialMessages, allMessages, friends, monitors, students, isMonitor }: Props) {
  const [messages, setMessages] = useState<MessageResponse[]>(initialMessages);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [conversations, setConversations] = useState(() => buildConversations(allMessages, me.id));
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("chats");
  const [seen, setSeen] = useState<Record<number, number>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const markedRef = useRef<number | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const seenRaw = localStorage.getItem(`chat_seen_${me.id}`);
    setSeen(seenRaw ? JSON.parse(seenRaw) : {});
  }, [me.id]);

  useEffect(() => {
    if (markedRef.current === receiver.id) return;
    const seenRaw = localStorage.getItem(`chat_seen_${me.id}`);
    const currentSeen: Record<number, number> = seenRaw ? JSON.parse(seenRaw) : {};
    const msgs = allMessages.filter(m => m.sender.id === receiver.id && m.receiver.id === me.id);
    if (msgs.length === 0) {
      markedRef.current = receiver.id;
      return;
    }
    const lastId = Math.max(...msgs.map(m => m.id));
    currentSeen[receiver.id] = lastId;
    localStorage.setItem(`chat_seen_${me.id}`, JSON.stringify(currentSeen));
    setSeen(currentSeen);
    markedRef.current = receiver.id;
    window.dispatchEvent(new Event("chatRead"));
  }, [receiver.id]); // ✅ solo depende de receiver.id

  function countUnread(senderId: number): number {
    const lastSeen = seen[senderId] ?? 0;
    return allMessages.filter(
      m => m.sender.id === senderId && m.receiver.id === me.id && m.id > lastSeen
    ).length;
  }

  const tabs: Tab[] = isMonitor
    ? ["chats", "amigos", "estudiantes", "monitores"]
    : ["chats", "amigos", "monitores"];

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleReload = async () => {
    setReloading(true);
    const result = await getConversationAction(me.id, receiver.id);
    if (!result.error) {
      setMessages(result.data);
      scrollToBottom();
    }
    setReloading(false);
  };

  const handleSend = async () => {
    if (!content.trim()) return;
    setSending(true);
    const result = await sendMessageAction(content.trim(), me.id, receiver.id);
    if (!result.error) {
      setMessages((prev) => [...prev, result.data]);
      setConversations((prev) => {
        const updated = prev.filter((c) => c.user.id !== receiver.id);
        return [{ user: receiver, lastMessage: result.data }, ...updated];
      });
      setContent("");
      scrollToBottom();
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const filteredConvos = conversations.filter((c) =>
    c.user.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredMonitors = monitors.filter((m) =>
    m.student?.user?.id !== me.id &&
    (m.student?.user?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );
  const filteredStudents = students.filter((s) =>
    s.user?.id !== me.id &&
    (s.user?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full overflow-hidden">

      <div className="w-80 border-r border-gray-100 bg-white flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-9 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#5856D6]/30"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex border-b border-gray-100">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-semibold capitalize transition ${tab === t ? "text-[#5856D6] border-b-2 border-[#5856D6]" : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">

          {tab === "chats" && (
            <>
              {filteredConvos.length === 0 && <p className="text-center text-gray-400 text-sm mt-8 px-4">Aún no tienes conversaciones.</p>}
              {filteredConvos.map((convo) => {
                const unread = countUnread(convo.user.id);
                const isActive = convo.user.id === receiver.id;
                return (
                  <a key={convo.user.id} href={`/chat/${convo.user.id}`}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${isActive ? "bg-[#EBEBFF]" : ""}`}
                  >
                    <img src={getAvatar(convo.user.avatar, convo.user.name)} alt={convo.user.name} className="w-11 h-11 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className={`text-sm truncate ${unread > 0 ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>
                          {convo.user.name}
                        </p>
                        <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1" suppressHydrationWarning>
                          {formatTimeShort(convo.lastMessage.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate ${unread > 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                          {convo.lastMessage.content}
                        </p>
                        {unread > 0 && (
                          <span className="ml-2 min-w-[18px] h-[18px] bg-[#5856D6] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 flex-shrink-0">
                            {unread > 9 ? "9+" : unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </>
          )}

          {tab === "amigos" && (
            <>
              {filteredFriends.length === 0 && <p className="text-center text-gray-400 text-sm mt-8 px-4">No tienes amigos agregados aún.</p>}
              {filteredFriends.map((friend) => {
                const unread = countUnread(friend.id);
                return (
                  <a key={friend.id} href={`/chat/${friend.id}`}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${friend.id === receiver.id ? "bg-[#EBEBFF]" : ""}`}
                  >
                    <img src={getAvatar(friend.avatar, friend.name)} alt={friend.name} className="w-11 h-11 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                    <div className="flex-1 min-w-0 flex justify-between items-center">
                      <p className={`text-sm truncate ${unread > 0 ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>
                        {friend.name}
                      </p>
                      {unread > 0 && (
                        <span className="ml-2 min-w-[18px] h-[18px] bg-[#5856D6] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 flex-shrink-0">
                          {unread > 9 ? "9+" : unread}
                        </span>
                      )}
                    </div>
                  </a>
                );
              })}
            </>
          )}

          {tab === "estudiantes" && (
            <>
              {filteredStudents.length === 0 && <p className="text-center text-gray-400 text-sm mt-8 px-4">No hay estudiantes disponibles.</p>}
              {filteredStudents.map((student) => {
                const name = student.user?.name ?? "Estudiante";
                const avatar = student.user?.avatar ?? null;
                const userId = student.user?.id;
                if (!userId) return null;
                const unread = countUnread(userId);
                return (
                  <a key={student.id} href={`/chat/${userId}`}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${userId === receiver.id ? "bg-[#EBEBFF]" : ""}`}
                  >
                    <img src={getAvatar(avatar, name)} alt={name} className="w-11 h-11 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className={`text-sm truncate ${unread > 0 ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>{name}</p>
                        {unread > 0 && (
                          <span className="ml-2 min-w-[18px] h-[18px] bg-[#5856D6] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 flex-shrink-0">
                            {unread > 9 ? "9+" : unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{student.career?.name ?? ""}</p>
                    </div>
                  </a>
                );
              })}
            </>
          )}

          {tab === "monitores" && (
            <>
              {filteredMonitors.length === 0 && <p className="text-center text-gray-400 text-sm mt-8 px-4">No hay monitores disponibles.</p>}
              {filteredMonitors.map((monitor) => {
                const name = monitor.student?.user?.name ?? "Monitor";
                const avatar = monitor.student?.user?.avatar ?? null;
                const userId = monitor.student?.user?.id;
                if (!userId) return null;
                const unread = countUnread(userId);
                return (
                  <a key={monitor.id} href={`/chat/${userId}`}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${userId === receiver.id ? "bg-[#EBEBFF]" : ""}`}
                  >
                    <img src={getAvatar(avatar, name)} alt={name} className="w-11 h-11 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className={`text-sm truncate ${unread > 0 ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>{name}</p>
                        {unread > 0 && (
                          <span className="ml-2 min-w-[18px] h-[18px] bg-[#5856D6] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 flex-shrink-0">
                            {unread > 9 ? "9+" : unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{monitor.subject}</p>
                    </div>
                  </a>
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="relative h-16 flex items-center px-5 gap-3 overflow-hidden flex-shrink-0">
          <img src="/FondoChats.png" alt="fondo" className="absolute inset-0 w-full h-full object-cover" />
          <div className="relative z-10 flex items-center gap-3 flex-1">
            <img src={getAvatar(receiver.avatar, receiver.name)} alt={receiver.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/60" />
            <div className="flex-1">
              <p className="font-bold text-white text-sm">{receiver.name}</p>
            </div>
            <button onClick={handleReload} disabled={reloading}
              className="relative z-10 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${reloading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {reloading ? "Cargando..." : "Recargar"}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3 bg-gray-50">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-10">Aún no hay mensajes. ¡Empieza la conversación!</p>
          )}
          {messages.map((msg) => {
            const isMine = msg.sender.id === me.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm ${isMine ? "bg-[#5856D6] text-white rounded-br-none" : "bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm"}`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1" suppressHydrationWarning>
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center gap-3 flex-shrink-0">
          <input type="text" value={content} onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown} placeholder="Escribe un mensaje..."
            className="flex-1 border border-gray-200 rounded-full px-5 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#5856D6]/30 transition"
          />
          <button onClick={handleSend} disabled={sending || !content.trim()}
            className="bg-[#5856D6] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#4745c0] transition-colors disabled:opacity-50"
          >
            {sending ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}