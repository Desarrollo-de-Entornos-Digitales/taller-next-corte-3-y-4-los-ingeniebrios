"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getConversationAction, sendMessageAction, MessageResponse } from "../actions/chat.action";

type User = {
  id: number;
  name: string;
  avatar: string | null;
};

type Props = {
  me: User;
  receiver: User;
  initialMessages: MessageResponse[];
  allMessages: MessageResponse[];
};

function getAvatar(avatar: string | null | undefined, name: string) {
  if (avatar && avatar.startsWith("data:")) return avatar;
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}`;
}

function formatTime(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Bogota",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function formatTimeShort(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Bogota",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

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

export default function ChatClient({ me, receiver, initialMessages, allMessages }: Props) {
  const [messages, setMessages] = useState<MessageResponse[]>(initialMessages);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [conversations, setConversations] = useState(() => buildConversations(allMessages, me.id));
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Polling cada 3 segundos para nuevos mensajes
  useEffect(() => {
    const interval = setInterval(() => {
      startTransition(async () => {
        const result = await getConversationAction(me.id, receiver.id);
        if (!result.error) setMessages(result.data);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [me.id, receiver.id]);

  const handleSend = async () => {
    if (!content.trim()) return;
    setSending(true);
    const result = await sendMessageAction(content.trim(), me.id, receiver.id);
    if (!result.error) {
      setMessages((prev) => [...prev, result.data]);
      // Actualizar sidebar con el nuevo mensaje
      setConversations((prev) => {
        const updated = prev.filter((c) => c.user.id !== receiver.id);
        return [{ user: receiver, lastMessage: result.data }, ...updated];
      });
      setContent("");
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredConvos = conversations.filter((c) =>
    c.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex overflow-hidden" style={{ height: 'calc(100svh - 64px)' }}>

      <div className="w-80 border-r border-gray-100 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-9 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#5856D6]/30"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConvos.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-8 px-4">
              Aún no tienes conversaciones.
            </p>
          )}
          {filteredConvos.map((convo) => (
            <a
              key={convo.user.id}
              href={`/chat/${convo.user.id}`}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                convo.user.id === receiver.id ? "bg-[#EBEBFF]" : ""
              }`}
            >
              <img
                src={getAvatar(convo.user.avatar, convo.user.name)}
                alt={convo.user.name}
                className="w-11 h-11 rounded-full object-cover border border-gray-200 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {convo.user.name}
                  </p>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1" suppressHydrationWarning>
                    {formatTimeShort(convo.lastMessage.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {convo.lastMessage.content}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="relative h-16 flex items-center px-5 gap-3 overflow-hidden">
          <img
            src="/FondoChats.png"
            alt="fondo"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 flex items-center gap-3">
            <img
              src={getAvatar(receiver.avatar, receiver.name)}
              alt={receiver.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/60"
            />
            <div>
              <p className="font-bold text-white text-sm">{receiver.name}</p>
              <p className="text-xs text-white/70">Monitor</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3 bg-gray-50">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-10">
              Aún no hay mensajes. ¡Empieza la conversación!
            </p>
          )}
          {messages.map((msg) => {
            const isMine = msg.sender.id === me.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                    isMine
                      ? "bg-[#5856D6] text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm"
                  }`}
                >
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

        <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center gap-3">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="flex-1 border border-gray-200 rounded-full px-5 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#5856D6]/30 transition"
          />
          <button
            onClick={handleSend}
            disabled={sending || !content.trim()}
            className="bg-[#5856D6] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#4745c0] transition-colors disabled:opacity-50"
          >
            {sending ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
