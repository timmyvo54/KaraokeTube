import express, { Express } from "express";
import routes from "./routes";
import cors from "cors";
import { NODE_ENV } from "./config";

const app: Express = express();

const PORT = 25565;

if (NODE_ENV === "development") {
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));
} else {
  console.log("CORS not enabled for production.");
}

// Parse JSON body
app.use(express.json());

app.use("/api", routes);

export default app;
