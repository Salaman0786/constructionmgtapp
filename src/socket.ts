import { io, Socket } from "socket.io-client";
let socket: Socket | null = null;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SOCKET_BASE_URL = API_BASE_URL.replace(/\/api$/, "");
export const connectSocket = (userId: string, role: string): Socket => {
  if (socket) return socket;

  socket = io(`${SOCKET_BASE_URL}/realtime`, {
    transports: ["websocket"],
    query: {
      userId,
      role,
    },
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
