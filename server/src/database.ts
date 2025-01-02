import { MongoClient } from "mongodb";
import { DATABASE_URL } from "./config";

const client: MongoClient = new MongoClient(DATABASE_URL);

export async function connectToDatabase(): Promise<MongoClient> {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    return client;
  } catch (error: unknown) {
    console.error("Failed to connect to MongoDB.", error);
    throw error;
  }
}
