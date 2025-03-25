import { connectToDatabase } from "./database";

export function generateRoomId(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;

  return Array.from({ length: 4 }, () =>
    characters.charAt(Math.floor(Math.random() * charactersLength))
  ).join("");
}

/**
 * Verifies that a room exists.
 * @param {string} roomCode - The room code to check.
 * @returns A promise that resolves to a boolean representing whether the room exists.
 */
export async function roomExists(roomCode: string): Promise<boolean> {
  const db = await connectToDatabase("karaoke_tube");
  const roomCollection = db.collection("rooms")

  const roomsArray = await roomCollection
    .find({ roomId: roomCode })
    .toArray();
    return roomsArray.length === 0;
}