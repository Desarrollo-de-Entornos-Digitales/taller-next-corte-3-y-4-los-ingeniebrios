// Chat Home Page - displays conversations list
// Server component that fetches user data, messages, friends, and monitors
import { getCurrentUserAction, getAllMessagesAction, getFriendsAction, getMonitorsAction, getStudentsAction } from "../chat/actions/chat.action";
import ChatHomeClient from "./ChatHomeClient";

// Chat Home Page component
export default async function ChatHomePage() {
  const meResult = await getCurrentUserAction();
  if (meResult.error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        No se pudo obtener tu sesión.
      </div>
    );
  }

  const me = meResult.data;

  const [allMessagesResult, friendsResult, monitorsResult, studentsResult] = await Promise.all([
    getAllMessagesAction(),
    getFriendsAction(me.id),
    getMonitorsAction(),
    getStudentsAction(),
  ]);

  const allMessages = allMessagesResult.error ? [] : allMessagesResult.data;
  const myMessages = allMessages.filter(
    (m: any) => m.sender.id === me.id || m.receiver.id === me.id
  );
  const friends = friendsResult.error ? [] : friendsResult.data;
  const monitors = monitorsResult.error ? [] : monitorsResult.data;
  const students = studentsResult.error ? [] : studentsResult.data;

  const isMonitor = monitors.some((m: any) => m.student?.user?.id === me.id);

  return (
    <ChatHomeClient
      me={me}
      allMessages={myMessages}
      friends={friends}
      monitors={monitors}
      students={students}
      isMonitor={isMonitor}
    />
  );
}
