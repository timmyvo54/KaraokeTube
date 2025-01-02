import express, { Express } from "express";
import routes from "./routes";

const app: Express = express();

const PORT = 25565;

// Parse JSON body
app.use(express.json());

app.use("/api", routes);

export default app;
