import dotenv from "dotenv";

dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL as string;
if (!DATABASE_URL) {
  throw new Error("Missing MongoDB Connection String!");
}
