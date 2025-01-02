import express, { Express } from "express";
import routes from "./routes";
import { connectToDatabase } from "./database";

const app: Express = express();

const PORT = 25565;

// Parse JSON body
app.use(express.json());

app.use("/api", routes);

(async (): Promise<void> => {
  try {
    app.listen(PORT, (): void => {
      console.log(`The server is running on port ${PORT}`);
    });
  } catch (error: unknown) {
    console.error("Failed to start the server.", error);
    process.exit(1);
  }
})();
