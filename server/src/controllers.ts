import { Request, Response } from "express";
import { connectToDatabase } from "./database";
import { Room } from "./interfaces";
import { generateRoomId } from "./utils";

/**
 * Creates a room given room details.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns A promise that resolves to void
 */
export async function createRoom(req: Request, res: Response): Promise<void> {
  /**
   * @roomName - The name of the room.
   * @hostName - The name of the host.
   * @password - The password for the room.
   * @responses
   * 400 - Input is not valid.
   * 500 - External/unknown error.
   * 201 - Successful creation of room.
   * @roomDetails - Contains information about room on creation.
   */
  try {
    let { roomName, hostName, password } = req.body;
    // Handles missing values
    if (!roomName || !hostName || !password) {
      res.status(400).json({
        message: "Request must contain a room name, host name, and password.",
      });
      return;
    }
    // Handles variables that aren't strings
    if (
      typeof roomName !== "string" ||
      typeof hostName !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        message: "Room name, host name, and password must all be strings.",
      });
      return;
    }
    // Removes white space from both sides
    roomName = roomName.trim();
    hostName = hostName.trim();
    password = password.trim();
    // Handles variables that are too long
    if (
      roomName.length > 100 ||
      hostName.length > 100 ||
      password.length > 100
    ) {
      res.status(400).json({
        message: "Room name, host name, or password is too long.",
      });
      return;
    }
    // Check that strings are non empty
    if (
      roomName.length === 0 ||
      hostName.length === 0 ||
      password.length === 0
    ) {
      res.status(400).json({
        message: "Room name, host name, or password is empty.",
      });
      return;
    }

    const db = await connectToDatabase("karaoke_tube");
    const roomCollection = db.collection("rooms");

    // Create unique identifier for room
    let newRoomId: string = "";
    while (newRoomId === "") {
      const temp: string = generateRoomId();
      if (
        (await roomCollection.find({ roomId: temp }).toArray()).length === 0
      ) {
        newRoomId = temp;
      }
    }

    const newRoom: Room = {
      roomId: newRoomId,
      roomName: roomName,
      hostName: hostName,
      password: password,
      users: [hostName],
      currentVideo: null,
      queue: [],
      createdAt: new Date(),
    };
    const result = await roomCollection.insertOne(newRoom);
    console.log("Room inserted with ID:", result.insertedId);

    res.status(201).json({
      message: "Room successfully created!",
      roomDetails: newRoom,
    });
    return;
  } catch (error: unknown) {
    console.error("An unknown error occurred while creating room.", error);
    res.status(500).json({
      message: "Unknown error encountered while creating room.",
    });
    return;
  }
}
