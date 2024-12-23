import { Request, Response } from "express";

/**
 * Creates a room given room details.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns A promise that resolves to void
 * @throws
 */
export async function createRoom(
  req: Request,
  res: Response
): Promise<void> {
  /**
   * API call for creating a room
   * Params: Room name, host name, password
   * Unsuccessfull response:
   * 400 Bad request - Room name, host name, or password too long
   * 500 Internal server error
   * Successfull response:
   * 201 Created
   */
  try {
    let { roomName, hostName, password } = req.body;
    // Handles missing values
    if (!roomName || !hostName || !password) {
      res.status(400).json({
        message: "Request must contain a room name, host name, and password"
      });
      return;
    }
    // Handles variables that aren't strings
    if (typeof roomName !== "string" || typeof hostName !== "string" || typeof password !== "string") {
      res.status(400).json({
        message: "Room name, host name, and password must all be strings"
      });
      return;
    }
    roomName = roomName.trim();
    hostName = hostName.trim();
    password = password.trim();
    console.log(`${roomName}, ${hostName}, ${password}`);
    // Handles variables that are too long
    if (roomName.length > 100 || hostName.length > 100 || password.length > 100) {
      res.status(400).json({
        message: "Room name, host name, or password is too long"
      });
      return;
    }
    // Check that strings are non empty
    if (roomName.length === 0 || hostName.length === 0 || password.length === 0) {
      res.status(400).json({
        message: "Room name, host name, or password is empty"
      });
      return;
    }

    // Create unique identifier room
    // 
  } catch (error: unknown) {

  }
}
