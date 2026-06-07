import { getCurrentUserAction, getConversationAction } from "../actions/chat.action";
import ChatClient from "../components/ChatClient";
import axiosClient, { safeRequest } from "../../../../lib/axios/client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ChatPage({ params }: Props) {
  const { id } = await params;
  const receiverId = Number(id);

  // Obtener usuario logueado y receptor en paralelo
  const [meResult, receiverResult] = await Promise.all([
    getCurrentUserAction(),
    safeRequest(axiosClient.get<any>(`/users/${receiverId}`)),
  ]);

  if (meResult.error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        No se pudo obtener tu sesión. Intenta recargar.
      </div>
    );
  }

  if (receiverResult.error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        No se encontró el usuario del monitor.
      </div>
    );
  }

  const me = meResult.data;
  const receiver = receiverResult.data;

  // Cargar mensajes iniciales en el servidor
  const convoResult = await getConversationAction(me.id, receiverId);
  const initialMessages = convoResult.error ? [] : convoResult.data;

  return (
    <ChatClient
      me={me}
      receiver={receiver}
      initialMessages={initialMessages}
    />
  );
}
