import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { connectSocket, disconnectSocket } from "./socket";
import { NOTIFICATION_EVENT } from "./notification-events";
import {
  useGetNotificationCountQuery,
  useGetNotificationsQuery,
} from "./features/notifications/api/notificationsApi";
import { toast } from "react-toastify";
import { playNotificationSound } from "./utils/playNotificationSound ";
import { useGetDrawingsQuery } from "./features/drawings&controls/api/drawingsApi";
import { useGetSubmittalsQuery } from "./features/submittals/api/submittalApi";

export default function App() {
  const authUser = useSelector((state: any) => state.auth.user);
  const hasConnected = useRef(false);
  const { refetch } = useGetNotificationCountQuery(undefined);
  const { refetch: refetchAll } = useGetNotificationsQuery({
    page: 1,
    limit: 10,
    type: "",
  });
  const { refetch: refetchAllUnread } = useGetNotificationsQuery({
    page: 1,
    limit: 10,
    type: "unread",
  });
  const { refetch: refetchAllRead } = useGetNotificationsQuery({
    page: 1,
    limit: 10,
    type: "read",
  });
  const { refetch: refetchDrawing } = useGetDrawingsQuery();
  const { refetch: refetchSubmittal } = useGetSubmittalsQuery({
    page: 1,
    limit: 10,
    search: "",
    category: "",
    projectId: "",
  });
  useEffect(() => {
    const unlockAudio = () => {
      const audio = new Audio("/sounds/notification.mp3");
      audio
        .play()
        .then(() => audio.pause())
        .catch(() => {});
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => window.removeEventListener("click", unlockAudio);
  }, []);
  useEffect(() => {
    if (!authUser?.id || !authUser?.role?.name) return;
    if (hasConnected.current) return;

    hasConnected.current = true;

    const socket = connectSocket(authUser.id, authUser.role.name);

    socket.on(NOTIFICATION_EVENT.PUSH, (notification) => {
      refetch();
      refetchAll();
      refetchAllRead();
      refetchAllUnread();
      refetchDrawing();
      refetchSubmittal();
      toast.info(`${notification.message}`);
      playNotificationSound();
      //showSuccess(notification.message);
    });
  }, [
    authUser?.id,
    authUser?.role?.name,
    refetch,
    refetchAll,
    refetchAllRead,
    refetchAllUnread,
    refetchDrawing,
    refetchSubmittal,
  ]);

  useEffect(() => {
    if (!authUser) {
      disconnectSocket();
      hasConnected.current = false;
    }
  }, [authUser]);

  return <AppRoutes />;
}
