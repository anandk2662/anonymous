import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

let io: IOServer | null = null;

export function initSocket(server: HTTPServer): IOServer {
  if (!io) {
    io = new IOServer(server, {
      path: "/api/socket_io",
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("message", (message: string) => {
        io?.emit("message", message);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  return io;
}

