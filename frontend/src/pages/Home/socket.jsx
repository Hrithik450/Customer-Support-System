import { io } from "socket.io-client";

const Socket = io(import.meta.env.VITE_BACKEND_URL, {
  autoConnect: false,
});

export default Socket;
