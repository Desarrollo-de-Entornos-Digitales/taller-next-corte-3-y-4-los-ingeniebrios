"use client";

import { useState } from "react";
import { MessageResponse, FriendUser } from "../chat/actions/chat.action";

type User = { id: number; name: string; avatar: string | null };
type Tab = "chats" | "amigos" | "monitores";

type Props = {
  me: User;
  allMessages: MessageResponse[];
  friends: FriendUser[];
  monitors: any[];
};

function getAvatar(avatar: string | null | undefined, name: string) {
  if (avatar && avatar.startsWith("data:")) return avatar;
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}`;
}

function formatTimeShort(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      hour: "2-digit", minute: "2-digit", timeZone: "America/Bogota",
    }).format(new Date(dateStr));
  } catch { return dateStr; }
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

export default function ChatHomeClient({ me, allMessages, friends, monitors }: Props) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("chats");
  const conversations = buildConversations(allMessages, me.id);

  const filteredConvos = conversations.filter(c => c.user.name.toLowerCase().includes(search.toLowerCase()));
  const filteredFriends = friends.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const filteredMonitors = monitors.filter(m => (m.student?.user?.name ?? "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
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
          {(["chats", "amigos", "monitores"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-semibold capitalize transition ${tab === t ? "text-[#5856D6] border-b-2 border-[#5856D6]" : "text-gray-400 hover:text-gray-600"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "chats" && (
            <>
              {filteredConvos.length === 0 && <p className="text-center text-gray-400 text-sm mt-8 px-4">Aún no tienes conversaciones.</p>}
              {filteredConvos.map((convo) => (
                <a key={convo.user.id} href={`/chat/${convo.user.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
                >
                  <img src={getAvatar(convo.user.avatar, convo.user.name)} alt={convo.user.name} className="w-11 h-11 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-800 text-sm truncate">{convo.user.name}</p>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1" suppressHydrationWarning>
                        {formatTimeShort(convo.lastMessage.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{convo.lastMessage.content}</p>
                  </div>
                </a>
              ))}
            </>
          )}

          {tab === "amigos" && (
            <>
              {filteredFriends.length === 0 && <p className="text-center text-gray-400 text-sm mt-8 px-4">No tienes amigos agregados aún.</p>}
              {filteredFriends.map((friend) => (
                <a key={friend.id} href={`/chat/${friend.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
                >
                  <img src={getAvatar(friend.avatar, friend.name)} alt={friend.name} className="w-11 h-11 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                  <p className="font-semibold text-gray-800 text-sm truncate">{friend.name}</p>
                </a>
              ))}
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
                return (
                  <a key={monitor.id} href={`/chat/${userId}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
                  >
                    <img src={getAvatar(avatar, name)} alt={name} className="w-11 h-11 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{name}</p>
                      <p className="text-xs text-gray-400 truncate">{monitor.subject}</p>
                    </div>
                  </a>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Panel derecho vacío */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-4xl mb-4">💬</p>
          <p className="font-bold text-gray-700 text-lg">Tus mensajes</p>
          <p className="text-gray-400 text-sm mt-1">Selecciona una conversación para comenzar</p>
        </div>
      </div>
    </div>
  );
}
