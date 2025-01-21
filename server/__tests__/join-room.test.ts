import { Server } from "http";
import request, { Response as SupertestResponse } from "supertest";
import { connectToDatabase } from "../src/database";
import { startServer, stopServer } from "../src/serverFile";

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

describe("POST /api/join-room tests.", (): void => {
  // Mocks successful/ideal responses
  const name = "Test Room Name";
  const roomCode = "TIMY";
  const password = "TestPassword123";
  beforeEach((): void => {
    const mockCollection = {
      find: jest.fn(() => ({
        toArray: jest.fn().mockResolvedValue([{
          roomId: roomCode,
          roomName: "Test room name",
          host: {
            name: "hostName",
            userId: 0
          },
          password: password,
          users: [{
            name: "hostName",
            userId: 0
          }],
          currentVideo: null,
          queue: [],
          createdAt: new Date()
        }]),
      })),
      findOneAndUpdate: jest.fn().mockResolvedValue({ 
        value: {
          roomId: roomCode,
          roomName: "Test room name",
          host: {
            name: "hostName",
            userId: 0
          },
          password: password,
          users: [{
            name: "hostName",
            userId: 0
          }, {
            name: name,
            userId: 1
          }],
          currentVideo: null,
          queue: [],
          createdAt: new Date()
        }
      }),
    };
    const mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    (connectToDatabase as jest.Mock).mockResolvedValue(mockDb);
  });
  let longString: string = "";
  for (let i = 0; i < 100; i++) {
    longString += "string";
  }

  describe("Error tests.", (): void => {
    describe("Validation errors.", (): void => {
      test("Should fail if name is missing.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            roomCode,
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Request must contain a name, room code, and password.",
        });
      });
      test("Should fail if roomCode is missing.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            name,
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Request must contain a name, room code, and password.",
        });
      });
      test("Should fail if password is missing.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            name,
            roomCode,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Request must contain a name, room code, and password.",
        });
      });
      test("Should fail if name is not a string.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            name: 1,
            roomCode,
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Name, room code, and password must all be strings.",
        });
      });
      test("Should fail if roomCode is not a string.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            name,
            roomCode: 1,
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Name, room code, and password must all be strings.",
        });
      });
      test("Should fail if password is not a string.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            name,
            roomCode,
            password: 1,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Name, room code, and password must all be strings.",
        });
      });
      test("Should fail if name is too long.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            name: longString,
            roomCode,
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Name, room code, and password is too long.",
        });
      });
      test("Should fail if roomCode is too long.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            name,
            roomCode: longString,
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Name, room code, and password is too long.",
        });
      });
      test("Should fail if password is too long.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            name,
            roomCode,
            password: longString,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Name, room code, and password is too long.",
        });
      });
      test("Should fail if name is empty.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            name: " ",
            roomCode,
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Name, room code, and password is empty.",
        });
      });
      test("Should fail if roomCode is empty.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            name,
            roomCode: " ",
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Name, room code, and password is empty.",
        });
      });
      test("Should fail if password is empty.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            name,
            roomCode,
            password: " ",
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Name, room code, and password is empty.",
        });
      });
      test("Should fail if room with code does not exist.", async (): Promise<void> => {
        const mockCollection = {
          find: jest.fn(() => ({
            toArray: jest.fn().mockResolvedValue([]),
          }))
        };
        const mockDb = {
          collection: jest.fn().mockReturnValue(mockCollection),
        };
        (connectToDatabase as jest.Mock).mockResolvedValue(mockDb);
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            name,
            roomCode,
            password
          });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
          message: "Room with code does not exist."
        });
      })
      test("Should fail if password does not match.", async (): Promise<void> => {
        const mockCollection = {
          find: jest.fn(() => ({
            toArray: jest.fn().mockResolvedValue([{
              password: password
            }]),
          }))
        };
        const mockDb = {
          collection: jest.fn().mockReturnValue(mockCollection),
        };
        (connectToDatabase as jest.Mock).mockResolvedValue(mockDb);
        const response: SupertestResponse = await request(server)
        .post("/api/join-room")
        .send({
          name,
          roomCode,
          password: "BadPassword123"
        });
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({
          message: "Password does not match room password.",
        })
      })
    });
    describe("Unexpected errors", (): void => {
      test("Should fail if connectToDatabase fails.", async (): Promise<void> => {
        (connectToDatabase as jest.Mock).mockRejectedValue(new Error());
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            name,
            roomCode,
            password,
          });
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
          message: "Unknown error encountered while joining room.",
        });
      });
      test("Should fail if findOneAndUpdate fails.", async (): Promise<void> => {
        const mockCollection = {
          find: jest.fn(() => ({
            toArray: jest.fn().mockResolvedValue([{
              password: password
            }]),
          })),
          findOneAndUpdate: jest.fn().mockRejectedValue(new Error()),
        };
        const mockDb = {
          collection: jest.fn().mockReturnValue(mockCollection),
        };
        (connectToDatabase as jest.Mock).mockResolvedValue(mockDb);
        const response: SupertestResponse = await request(server)
          .post("/api/join-room")
          .send({
            name,
            roomCode,
            password,
          });
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
          message: "Unknown error encountered while joining room.",
        });
      });
    });
  });
  describe("Successful tests", (): void => {
    test("Should successfully join and return room details.", async (): Promise<void> => {
      consoleErrorSpy.mockRestore();
      const response: SupertestResponse = await request(server)
        .post("/api/join-room")
        .send({
          name,
          roomCode,
          password,
        });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        message: "Room successfully joined!",
        roomDetails: {
          roomId: roomCode,
          roomName: "Test room name",
          host: {
            name: "hostName",
            userId: 0
          },
          password: password,
          users: [{
            name: "hostName",
            userId: 0
          },
          {
            name: name,
            userId: 1
          }],
          currentVideo: null,
          queue: [],
          createdAt: expect.any(String)
        },
      });
    });
  });
});
