import app from "./app"; // Import your Express app
import { Server } from "http"; // Import http.Server type

let server: Server;

export function startServer(port: number): Server {
  server = app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
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
