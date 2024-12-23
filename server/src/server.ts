import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes";

dotenv.config();

const app: Express = express();

const PORT = 25565;

// Parse JSON body
app.use(express.json());

// Connects to MongoDB Atlas
mongoose
  .connect(process.env.DB_URL!)
  .then((): void => console.log("Connected to MongoDB Atlas"))
  .catch((error: unknown): void => console.error("MongoDB connection error: ", error));

app.use("/api", routes);

app.listen(PORT, (): void => {
  console.log(`The server is running on port ${PORT}`);
});
