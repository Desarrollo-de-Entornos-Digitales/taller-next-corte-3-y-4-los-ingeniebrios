"use client";
import Link from 'next/link';
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

// Interface for application notifications
interface AppNotification {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
  sender?: {
    id: number;
    name: string;
    avatar?: string;
  };
}

// Navbar component - main navigation bar with notifications and user menu
// Handles user profile data, notifications, and navigation
export default function Navbar() {
  const pathname = usePathname();
  const [avatar, setAvatar] = useState("/avatar.png");
  const [isAdmin, setIsAdmin] = useState(false);
  const [myId, setMyId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  // Get authentication token from cookies or localStorage
  const getToken = () =>
    localStorage.getItem("token") ??
    document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1] ??
    null;

  // Fetch user avatar and check admin status
  const fetchAvatar = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const permissions: string[] = payload.permissions ?? [];
      setIsAdmin(permissions.includes("manage_users"));

      const extractedId = payload.id ?? payload.sub ?? payload.userId ?? payload.user?.id ?? null;
      if (extractedId) setMyId(extractedId);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.id) setMyId(data.id);
        setAvatar(data.avatar?.startsWith("data:") ? data.avatar : "/avatar.png");
      }
    } catch (error) {
      console.error("Error cargando avatar:", error);
    }
  }, []);

  // Fetch unread messages count for current user
  const fetchUnreadMessages = useCallback(async (userId: number) => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) return;

      const allMessages = await res.json();

      // Solo mensajes recibidos por mí
      const received = allMessages.filter((m: any) => m.receiver?.id === userId);

      // Leer últimos IDs leídos del localStorage
      const seenRaw = localStorage.getItem(`chat_seen_${userId}`);
      const seen: Record<number, number> = seenRaw ? JSON.parse(seenRaw) : {};

      // Agrupar por conversación y contar no leídos
      let total = 0;
      const bySender = new Map<number, number[]>();
      for (const msg of received) {
        const sid = msg.sender?.id;
        if (!sid) continue;
        if (!bySender.has(sid)) bySender.set(sid, []);
        bySender.get(sid)!.push(msg.id);
      }

      for (const [senderId, ids] of bySender.entries()) {
        const lastSeen = seen[senderId] ?? 0;
        const newCount = ids.filter(id => id > lastSeen).length;
        total += newCount;
      }

      setUnreadMessages(total);
    } catch {
      // silencioso
    }
  }, []);

  // Fetch count of unread notifications for the user
  const fetchUnreadCount = useCallback(async (userId: number) => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/count/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count ?? 0);
      }
    } catch {
      // silencioso
    }
  }, []);

  useEffect(() => {
    fetchAvatar();
  }, [pathname, fetchAvatar]);

  useEffect(() => {
    if (!myId || isAdmin) return;
    fetchUnreadCount(myId);
    fetchUnreadMessages(myId);
    const interval = setInterval(() => {
      fetchUnreadCount(myId);
      fetchUnreadMessages(myId);
    }, 30_000);
    return () => clearInterval(interval);
  }, [myId, isAdmin, fetchUnreadCount, fetchUnreadMessages]);

  // ✅ Cuando el usuario entra a un chat, marca como leído
  useEffect(() => {
    if (!myId) return;
    const match = pathname.match(/^\/chat\/(\d+)$/);
    if (!match) return;
    const otherId = Number(match[1]);

    // Buscar el último mensaje de esa conversación y marcarlo como visto
    const token = getToken();
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/message`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(r => r.json())
      .then((msgs: any[]) => {
        const fromOther = msgs.filter(
          m => m.sender?.id === otherId && m.receiver?.id === myId
        );
        if (fromOther.length === 0) return;
        const lastId = Math.max(...fromOther.map(m => m.id));
        const seenRaw = localStorage.getItem(`chat_seen_${myId}`);
        const seen: Record<number, number> = seenRaw ? JSON.parse(seenRaw) : {};
        seen[otherId] = lastId;
        localStorage.setItem(`chat_seen_${myId}`, JSON.stringify(seen));
        fetchUnreadMessages(myId);
      })
      .catch(() => { });
  }, [pathname, myId]);

  const loadNotifications = async () => {
    setLoadingNotif(true);
    setHasChecked(true);
    try {
      const token = getToken();
      if (!token || !myId) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/user/${myId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (res.ok) {
        const data: AppNotification[] = await res.json();
        setNotifications(data);

        // Marcar todas las no leídas como leídas
        const unread = data.filter((n: AppNotification) => !n.read);
        for (const notif of unread) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${notif.id}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error cargando notificaciones:", err);
    } finally {
      setLoadingNotif(false);
    }
  };

  const handleRequestAction = async (
    notif: AppNotification,
    action: 'accepted' | 'rejected',
  ) => {
    const senderId = notif.sender?.id;
    if (!senderId || !myId) {
      alert("No se pudo identificar al remitente.");
      return;
    }

    setProcessingIds(prev => new Set(prev).add(notif.id));

    try {
      const token = getToken();
      if (!token) return;

      const checkRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/request/${senderId}/${myId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!checkRes.ok) throw new Error("No se pudo verificar la solicitud.");
      const checkData = await checkRes.json();

      console.log("checkData:", checkData);
      console.log("requestId:", checkData.requestId);

      if (!checkData.requestId) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${notif.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(prev => prev.filter(n => n.id !== notif.id));
        setUnreadCount(prev => Math.max(0, prev - 1));
        return;
      }

      if (action === 'accepted') {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/friends/${checkData.requestId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status: 'accepted' }),
        });
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/friends/${checkData.requestId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${notif.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(prev => prev.filter(n => n.id !== notif.id));
      setUnreadCount(prev => Math.max(0, prev - 1));
      window.dispatchEvent(new Event("friendshipChanged"));

    } catch (err) {
      console.error("Error procesando acción:", err);
      console.log("senderId:", senderId, "myId:", myId);
      alert("Ocurrió un error. Intenta de nuevo.");
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(notif.id);
        return next;
      });
    }
  };

  const links = [
    ...(!isAdmin ? [{ label: "Pregunta", href: "/questions" }] : []),
    { label: "Comunidad", href: "/feed" },
    { label: "Monitores", href: "/monitors" },
    ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
  ];

  return (
    <nav className="w-full h-20 bg-white shadow-sm flex items-center justify-between px-10 relative z-40">
      <div className="flex items-center gap-4">

        {/* Menú hamburguesa */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#5856D6] text-3xl hover:opacity-80 transition"
          >
            ☰
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute left-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 w-52 z-50 py-2 overflow-hidden">
                {/* ✅ Solo Chats con ícono comment.svg y badge */}
                {!isAdmin && (
                  <Link
                    href="/chat-home"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-[#EBEBFF] hover:text-[#5856D6] transition-colors font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <img src="/comment.svg" alt="Chats" className="w-5 h-5" />
                      Mis chats
                    </div>
                    {/* ✅ Badge de mensajes no leídos */}
                    {unreadMessages > 0 && (
                      <span className="min-w-[20px] h-5 bg-[#5856D6] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {unreadMessages > 9 ? '9+' : unreadMessages}
                      </span>
                    )}
                  </Link>
                )}
                <button
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await fetch("/api/logout", { method: "POST" });
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                >
                  <img src="/logout.svg" alt="Logout" className="w-5 h-5" />
                    Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-16 font-semibold">
        {links.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}
              className={`transition ${isActive
                ? "text-[#5856D6] border-b-2 border-[#5856D6] pb-1"
                : "text-gray-400 hover:text-[#5856D6]"}`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        {!isAdmin && (
          <button
            onClick={() => {
              setIsModalOpen(true);
              setHasChecked(false);
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition relative"
            aria-label="Notificaciones"
          >
            <img
              src="/notifications.svg"
              alt="Notificaciones"
              className="w-6 h-6"
            />

            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        )}

        <Link href={isAdmin ? "/admin" : "/profile"}>
          <div className="p-[3px] rounded-full border-[3px] border-[#5856D6]">
            <img src={avatar} alt="Mi perfil" className="w-12 h-12 rounded-full object-cover" />
          </div>
        </Link>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="bg-white rounded-3xl p-6 w-[420px] shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-gray-800">Notificaciones</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 text-lg hover:text-gray-600 transition">✕</button>
            </div>

            <button onClick={loadNotifications} disabled={loadingNotif}
              className="w-full bg-[#5856D6] disabled:bg-indigo-300 text-white text-xs font-semibold py-2 rounded-xl mb-4 hover:bg-[#4745b4] transition"
            >
              {loadingNotif ? "Verificando..." : "Verificar notificaciones"}
            </button>

            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
              {loadingNotif ? (
                <p className="text-xs text-center text-gray-400 py-6">Buscando notificaciones...</p>
              ) : !hasChecked ? (
                <p className="text-xs text-center text-gray-400 py-6">Presiona el botón para sincronizar tus alertas.</p>
              ) : notifications.length === 0 ? (
                <p className="text-xs text-center text-gray-400 py-6">No tienes notificaciones pendientes.</p>
              ) : (
                notifications.map((notif) => {
                  const isProcessing = processingIds.has(notif.id);
                  const isFriendRequest = notif.message.toLowerCase().includes("solicitud de amistad");
                  return (
                    <div key={notif.id}
                      className={`bg-gray-50 border border-gray-100 p-3 rounded-xl flex flex-col gap-2 transition ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <div className="flex gap-2 items-center">
                        <img
                          src={notif.sender?.avatar?.startsWith("data:") ? notif.sender.avatar : "/avatar.png"}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          alt={notif.sender?.name ?? "Usuario"}
                        />
                        <div className="flex-1 min-w-0">
                          {notif.sender?.name && <p className="text-xs font-bold text-gray-800 truncate">{notif.sender.name}</p>}
                          <p className="text-xs text-gray-600">{notif.message}</p>
                        </div>
                        {!notif.read && <span className="w-2 h-2 bg-[#5856D6] rounded-full flex-shrink-0" />}
                      </div>
                      {isFriendRequest && (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleRequestAction(notif, 'rejected')} disabled={isProcessing}
                            className="bg-gray-200 text-gray-700 text-[11px] px-3 py-1.5 rounded-lg font-bold hover:bg-gray-300 transition">
                            Rechazar
                          </button>
                          <button onClick={() => handleRequestAction(notif, 'accepted')} disabled={isProcessing}
                            className="bg-[#5856D6] text-white text-[11px] px-3 py-1.5 rounded-lg font-bold hover:bg-[#4745b4] transition">
                            Aceptar
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}