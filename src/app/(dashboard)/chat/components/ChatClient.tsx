"use client";

import { useEffect, useRef, useState } from "react";
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
};

function getAvatar(avatar: string | null | undefined, name: string) {
  if (avatar && avatar.startsWith("data:")) return avatar;
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}`;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("es-CO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatClient({ me, receiver, initialMessages }: Props) {
  const [messages, setMessages] = useState<MessageResponse[]>(initialMessages);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Polling cada 3 segundos para nuevos mensajes
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await getConversationAction(me.id, receiver.id);
      if (!result.error) setMessages(result.data);
    }, 3000);
    return () => clearInterval(interval);
  }, [me.id, receiver.id]);

  const handleSend = async () => {
    if (!content.trim()) return;
    setSending(true);

    const result = await sendMessageAction(content.trim(), me.id, receiver.id);
    if (!result.error) {
      setMessages((prev) => [...prev, result.data]);
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

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-3xl mx-auto">
      {/* Header del chat */}
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
        <img
          src={getAvatar(receiver.avatar, receiver.name)}
          alt={receiver.name}
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
        <div>
          <p className="font-bold text-gray-800 text-sm">{receiver.name}</p>
          <p className="text-xs text-gray-400">Monitor</p>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">
            Aún no hay mensajes. ¡Empieza la conversación!
          </p>
        )}

        {messages.map((msg) => {
          const isMine = msg.sender.id === me.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                  isMine
                    ? "bg-[#5856D6] text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm"
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">
                {formatTime(msg.createdAt)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
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
  );
}
