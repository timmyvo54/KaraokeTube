import http, { Server as HTTPServer } from "http";
import { Server as IOServer, Socket } from "socket.io";
import app from "./app";
import { NODE_ENV } from "./config";

let server: HTTPServer;
let io: IOServer;

export function startServer(port: number): HTTPServer {
  server = http.createServer(app);

  io = new IOServer(server, {
    cors:
      NODE_ENV === "development"
        ? {
            origin: "http://localhost:5173",
            credentials: true,
          }
        : undefined,
  });

  io.on("connection", (socket: Socket): void => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("disconnect", (): void => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  server.listen(port, (): void => {
    console.log(`The server is listening on port ${port}`);
  });
  return server;
}

export function stopServer(done: () => void): void {
  if (server) {
    server.close(done);
  } else {
    done();
  }
}

export function getIO(): IOServer {
  return io;
}
