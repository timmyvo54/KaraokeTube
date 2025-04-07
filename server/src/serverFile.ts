import http, { Server as HTTPServer } from "http";
import { Server as IOServer, Socket } from "socket.io";
import * as cookie from "cookie";
import app from "./app";
import { NODE_ENV } from "./config";
import { connectToDatabase } from "./database";

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

  io.use(async (socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      const roomCode = socket.handshake.auth.roomCode;
      if (!cookies) {
        console.log("No cookies found.");
        return next(
          new Error("Authentication required to connect to WebSocket.")
        );
      }

      const parsedCookies = cookie.parse(cookies);
      const authCookie = parsedCookies.auth;

      if (!authCookie) {
        console.log("Authentication cookie not found.");
        return next(new Error("Missing credentials to connect to WebSocket."));
      }

      const { user, roomId, password } = JSON.parse(authCookie);
      if (!user || !roomId || !password) {
        console.log("Cookie does not contain all necessary information.");
        return next(
          new Error("Cookie does not contain all necessary information.")
        );
      }
      if (!user.name || user.userId === undefined || user.userId === null) {
        console.log("Cookie does not contain user information.");
        return next(new Error("Cookie does not contain user information."));
      }
      if (roomId != roomCode) {
        console.log("Mismatched room code.");
        return next(new Error("Mismatched room code."));
      }
      // Check that newRoomId exists and if it does, check the password
      const db = await connectToDatabase("karaoke_tube");
      const roomCollection = db.collection("rooms");
      const roomsArray = await roomCollection
        .find({ roomId: roomId })
        .toArray();
      // Check that room exists
      if (roomsArray.length === 0) {
        console.log("Room with code does not exist.");
        return next(new Error("Room with code does not exist."));
      }
      // Check that password matches
      if (roomsArray[0].password !== password) {
        console.log("Incorrect room password.");
        return next(new Error("Incorrect room password."));
      }
      // Check that user with id does not already exist in the room
      if (
        roomsArray[0].users.some(
          (userInRoom: { name: string; userId: number }) =>
            userInRoom.userId == user.userId
        )
      ) {
        console.log("User already exists in room.");
        return next(new Error("User already exists in room."));
      }

      socket.data.user = user;
      socket.data.roomId = roomId;

      console.log(`Authenticated socket: ${socket.id}.`);
      next();
    } catch (error: unknown) {
      console.error(
        "Unexpected error while authenticating WebSocket connection."
      );
      return next(
        new Error("Unexpected error while authenticating WebSocket connection.")
      );
    }
  });

  io.on("connection", (socket: Socket): void => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join-room", async ({ roomCode }) => {
      try {
        const { user, roomId } = socket.data;

        const db = await connectToDatabase("karaoke_tube");
        const roomCollection = db.collection("rooms");

        await roomCollection.updateOne(
          { roomId: roomId },
          { $addToSet: { users: user } }
        );

        socket.join(roomCode);
        console.log(`User ${socket.id} joined room ${roomCode}.`);
      } catch (error: unknown) {
        console.error("Failed to join room: ", error);
      }
    });

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
