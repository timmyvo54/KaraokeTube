import { Request, Response } from "express";
import { connectToDatabase } from "./database";
import { Room, User } from "./interfaces";
import { generateRoomId } from "./utils";
import { PushOperator } from "mongodb";
import { NODE_ENV } from "./config";

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

    const hostUser: User = {
      name: hostName,
      userId: 0
    };

    const newRoom: Room = {
      roomId: newRoomId,
      roomName: roomName,
      host: hostUser,
      password: password,
      users: [],
      currentVideo: null,
      queue: [],
      createdAt: new Date(),
    };
    const result = await roomCollection.insertOne(newRoom);
    console.log("Room inserted with ID:", result.insertedId);

    /**
     * @todo Send cookie with authentication details to user
     */
    const auth = JSON.stringify({
      hostUser, newRoomId, password
    });
    res.cookie("auth", auth, {
      httpOnly: true,
      secure: NODE_ENV !== "development",
      sameSite: NODE_ENV === "development" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

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

/**
 * Joins a room given room details.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns A promise that resolves to void
 */
export async function joinRoom(req: Request, res: Response): Promise<void> {
  /**
   * @name - The name of the user joining the room.
   * @roomCode - The unique identifying code of the room.
   * @password - The password for the room.
   * @responses
   * 400 - Input is not valid.
   * 404 - Room with code does not exist.
   * 403 - Password does not match room password.
   * 500 - External/unknown error.
   * 200 - Successful joins room.
   * @roomDetails - Contains information about the room the user is joining.
   */

  /** 
   * @todo Set user's cookie
   */

  try {
    let { name, roomCode, password } = req.body;
    // Handles missing values
    if (!name || !roomCode || !password) {
      res.status(400).json({
        message: "Request must contain a name, room code, and password.",
      });
      return;
    }
    // Handles variables that aren't strings
    if (
      typeof name !== "string" ||
      typeof roomCode !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        message: "Name, room code, and password must all be strings.",
      });
      return;
    }
    // Removes white space from both sides
    name = name.trim();
    roomCode = roomCode.trim();
    password = password.trim();
    // Handles variables that are too long
    if (
      name.length > 100 ||
      roomCode.length > 100 ||
      password.length > 100
    ) {
      res.status(400).json({
        message: "Name, room code, and password is too long.",
      });
      return;
    }
    // Check that strings are non empty
    if (
      name.length === 0 ||
      roomCode.length === 0 ||
      password.length === 0
    ) {
      res.status(400).json({
        message: "Name, room code, and password is empty.",
      });
      return;
    }
    const db = await connectToDatabase("karaoke_tube");
    const roomCollection = db.collection("rooms");
    // Check that room code exists
    const roomsArray = await roomCollection.find({ roomId: roomCode }).toArray();
    if (roomsArray.length === 0) {
      res.status(404).json({
        message: "Room with code does not exist.",
      });
      return;
    }
    // Check that password matches
    if (roomsArray[0].password !== password) {
      res.status(403).json({
        message: "Password does not match room password.",
      });
      return;
    }

    const newUser: User = {
      name: name,
      userId: roomsArray[0].users.length
    };

    const updatedRoom = await roomCollection.findOneAndUpdate(
      { roomId: roomCode },
      { $push: { users: newUser } as PushOperator<Document>},
      {
        returnDocument: "after"
      }
    );
    console.log("Updated room:", updatedRoom!.value);

    res.status(200).json({
      message: "Room successfully joined!",
      roomDetails: updatedRoom!.value,
    });
    return;
  } catch (error: unknown) {
    console.error("An unknown error occurred while joining room.", error);
    res.status(500).json({
      message: "Unknown error encountered while joining room.",
    });
    return;
  }
}

/**
 * Verifies that room exists.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns A promise that resolves to void
 */
export async function verifyRoomExists(req: Request, res: Response): Promise<void> {
  try {
    /**
     * @roomCode - The unique identifying code of the room.
     * @responses
     * 404 - Room code does not exist.
     * 500 - External/unknown error.
     * 200 - Room code exists.
     */
    const roomCode = req.query.roomCode as string;

    // Connect to database
    const db = await connectToDatabase("karaoke_tube");
    const roomCollection = db.collection("rooms");

    // Check that room code exists
    const roomsArray = await roomCollection.find({ roomId: roomCode }).toArray();
    if (roomsArray.length === 0) {
      res.status(404).json({
        message: "Room with code does not exist.",
      });
    } else {
      res.status(200).json({
        message: "Room exists.",
      });
    }
    return;
  } catch (error: unknown) {
    res.status(500).json({
      message: "Unknown error encountered while verifying room details."
    });
    return;
  }
}

/**
 * Handles the handshake between the client and server.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns A promise that resolves to void
 */
export async function handshake(req: Request, res: Response): Promise<void> {
  /**
   * @authCookie - The information contained required to establish a handshake.
   * @responses
   * 401 - Authentication cookie does not exist
   * 500 - External/unknown error.
   * 200 - Connection successfully established.
   */
  try {
    const authCookie: string = req.cookies.auth as string;
    console.log(authCookie);
    if (!authCookie) {
      res.status(401).json({
        message: "Authentication cookie does not exist."
      });
      return;
    }
    const { hostUser, newRoomId, password } = JSON.parse(authCookie);
    if (!hostUser || !newRoomId || !password) {
      res.status(401).json({
        message: "Cookie does not contain all necessary information."
      });
      return;
    }
    // Check that newRoomId exists and if it does, check the password
    const db = await connectToDatabase("karaoke_tube");
    const roomCollection = db.collection("rooms");
    const roomsArray = await roomCollection.find({ roomId: newRoomId }).toArray();
    // Check that room exists
    if (roomsArray.length === 0) {
      res.status(404).json({
        message: "Room with code does not exist.",
      });
      return;
    };
    // Check that password matches
    if (roomsArray[0].password !== password) {
      res.status(401).json({
        message: "Incorrect room password.",
      });
      return;
    }
    // Check that user with id does not already exist in the room
    if (roomsArray[0].users.some((user: { name: string, userId: number }) => user.userId == hostUser.userId)) {
      res.status(401).json({
        message: "User already exists in room."
      });
      return;
    }
    /**
     * @TODO implement handshake
     */
    res.status(200).json({
      message: "Connection successfully established.",
    });
    return;
  } catch (error: unknown) { 
    console.error("An unknown error occurred during handshake.", error);
    res.status(500).json({
      message: "Unknown error encountered during handshake."
    });
  }
}

/**
 * Handles leaving the room.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns A promise that resolves to void
 */
export async function exitRoom(req: Request, res: Response): Promise<void> {
  // @todo Implement
}