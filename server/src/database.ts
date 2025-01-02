import { Db, MongoClient } from "mongodb";
import { DATABASE_URL } from "./config";

let client: MongoClient;
let db: Db;

export async function connectToDatabase(dbName: string): Promise<Db> {
  try {
    client = new MongoClient(DATABASE_URL);
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error: unknown) {
    console.error("Failed to connect to MongoDB.", error);
    throw error;
  }
  if (!db) {
    db = client.db(dbName);
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    console.log("Disconnected from MongoDB.");
  }
}
