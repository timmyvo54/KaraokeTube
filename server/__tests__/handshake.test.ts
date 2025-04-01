import { Server } from "http";
import request, { Response as SupertestResponse } from "supertest";
import { startServer, stopServer } from "../src/serverFile";
import { connectToDatabase } from "../src/database";

let server: Server;
let consoleErrorSpy: jest.SpyInstance;

beforeAll((): void => {
  server = startServer(3000);
});

beforeEach((): void => {
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(jest.fn());
});

afterAll((done): void => {
  stopServer(done);
});

jest.mock("../src/database");

describe("POST /api/handshake tests.", (): void => {
  const authCookie = JSON.stringify({
    user: {
      name: "Jacob",
      userId: "1"
    },
    roomId: "SEBO",
    password: "qwerty4"
  })
  const roomCode = "SEBO";

  // Mocks successful/ideal responses
  let mockCollection;
  let mockDb;
  beforeEach((): void => {
    mockCollection = {
      find: jest.fn(() => ({
        toArray: jest.fn().mockResolvedValue([
          { 
            password: "qwerty4",
            users: []
          }
        ]),
      }))
    };
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    (connectToDatabase as jest.Mock).mockResolvedValue(mockDb);
  });

  describe("Error tests.", (): void => {
    describe("Validation errors.", (): void => {
      test("Should fail if room code does not exist.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/handshake")
          .set("Cookie", `auth=${authCookie}`);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
          message: "Room code does not exist."
        });
      });
      test("Should fail if auth cookie is missing.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/handshake")
          .send({
            roomCode
          });
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
          message: "Authentication cookie does not exist."
        });
      });
      test("Should fail if cookie does not contain necessary information.", async (): Promise<void> => {
        const badCookie = JSON.stringify({
          roomId: "SEBO",
          password: "qwerty4"
        });
        const response: SupertestResponse = await request(server)
          .post("/api/handshake")
          .set("Cookie", `auth=${badCookie}`)
          .send({
            roomCode
          });
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
          message: "Cookie does not contain all necessary information."
        });
      });
      test("Should fail if user in cookie does not have all necessary information.", async (): Promise<void> => {
        const badCookie = JSON.stringify({
          user: {
            userId: "1"
          },
          roomId: "SEBO",
          password: "qwerty4"
        })
        const response: SupertestResponse = await request(server)
          .post("/api/handshake")
          .set("Cookie", `auth=${badCookie}`)
          .send({
            roomCode
          });
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
          message: "Cookie does not contain user information."
        });
      });
      test("Should fail if room ID from cookie does not match room code.", async (): Promise<void> => {
        const badRoomCode = "OHNO";
        const response: SupertestResponse = await request(server)
        .post("/api/handshake")
        .set("Cookie", `auth=${authCookie}`)
        .send({
          roomCode: badRoomCode
        });
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
          message: "Mismatched room code."
        });
      });
      test("Should fail if room with code does not exist.", async (): Promise<void> => {
        mockCollection = {
          find: jest.fn(() => ({
            toArray: jest.fn().mockResolvedValue([]),
          }))
        };
        mockDb = {
          collection: jest.fn().mockReturnValue(mockCollection),
        };
        (connectToDatabase as jest.Mock).mockResolvedValue(mockDb);
        const response: SupertestResponse = await request(server)
        .post("/api/handshake")
        .set("Cookie", `auth=${authCookie}`)
        .send({
          roomCode
        });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
          message: "Room with code does not exist."
        });
      });
      test("Should fail if room password is incorrect.", async (): Promise<void> => {
        const badCookie = JSON.stringify({
          user: {
            name: "Jacob",
            userId: "1"
          },
          roomId: "SEBO",
          password: "wrongPassword"
        });
        const response: SupertestResponse = await request(server)
          .post("/api/handshake")
          .set("Cookie", `auth=${badCookie}`)
          .send({
            roomCode
          });
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
          message: "Incorrect room password."
        });
      });
      test("Should fail if user already exists in the room.", async (): Promise<void> => {
        mockCollection = {
          find: jest.fn(() => ({
            toArray: jest.fn().mockResolvedValue([
              { 
                password: "qwerty4",
                users: [
                  {
                    name: "Jacob",
                    userId: "1"
                  },
                ]
              }
            ]),
          }))
        };
        mockDb = {
          collection: jest.fn().mockReturnValue(mockCollection),
        };
        (connectToDatabase as jest.Mock).mockResolvedValue(mockDb);
        const response: SupertestResponse = await request(server)
          .post("/api/handshake")
          .set("Cookie", `auth=${authCookie}`)
          .send({
            roomCode
          });
        expect(response.statusCode).toEqual(401);
        expect(response.body).toEqual({
          message: "User already exists in room."
        });
      });
    });
    describe("Unexpected errors.", (): void => {
      test("Should fail if connectToDatabase fails.", async (): Promise<void> => {
        (connectToDatabase as jest.Mock).mockRejectedValue(new Error());
        const response: SupertestResponse = await request(server)
        .post("/api/handshake")
        .set("Cookie", `auth=${authCookie}`)
        .send({
          roomCode
        });
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
          message: "Unknown error encountered during handshake.",
        });
      });
    });
  });
  describe("Successful tests.", (): void => {
    test("Should successfully return a message.", async (): Promise<void> => {
      const response: SupertestResponse = await request(server)
        .post("/api/handshake")
        .set("Cookie", `auth=${authCookie}`)
        .send({
          roomCode
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        message: "Connection successfully established."
      });
    });
  });
});
