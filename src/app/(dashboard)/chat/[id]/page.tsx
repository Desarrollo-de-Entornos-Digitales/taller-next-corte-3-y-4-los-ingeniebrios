import { getCurrentUserAction, getConversationAction, getAllMessagesAction, getFriendsAction, getMonitorsAction, getStudentsAction } from "../actions/chat.action";
import ChatClient from "../components/ChatClient";
import axiosClient, { safeRequest } from "../../../../lib/axios/client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ChatPage({ params }: Props) {
  const { id } = await params;
  const receiverId = Number(id);

  const [meResult, receiverResult, allMessagesResult] = await Promise.all([
    getCurrentUserAction(),
    safeRequest(axiosClient.get<any>(`/users/${receiverId}`)),
    getAllMessagesAction(),
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
  const allMessages = allMessagesResult.error ? [] : allMessagesResult.data;

  const myMessages = allMessages.filter(
    (m: any) => m.sender.id === me.id || m.receiver.id === me.id
  );

  const [friendsResult, monitorsResult, studentsResult] = await Promise.all([
    getFriendsAction(me.id),
    getMonitorsAction(),
    getStudentsAction(),
  ]);

  const friends = friendsResult.error ? [] : friendsResult.data;
  const monitors = monitorsResult.error ? [] : monitorsResult.data;
  const students = studentsResult.error ? [] : studentsResult.data;

  const isMonitor = monitors.some((m: any) => m.student?.user?.id === me.id);

  const convoResult = await getConversationAction(me.id, receiverId);
  const initialMessages = convoResult.error ? [] : convoResult.data;

  return (
    <ChatClient
      me={me}
      receiver={receiver}
      initialMessages={initialMessages}
      allMessages={myMessages}
      friends={friends}
      monitors={monitors}
      students={students}
      isMonitor={isMonitor}
    />
  );
}
