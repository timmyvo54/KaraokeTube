import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes";
import { NODE_ENV } from "./config";

const app: Express = express();

if (NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
} else {
  console.log("CORS not enabled for production.");
}

// Parse JSON body
app.use(express.json());

// Parse cookies
app.use(cookieParser());

app.use("/api", routes);

export default app;
