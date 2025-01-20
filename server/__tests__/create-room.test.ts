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

describe("POST /api/create-room tests.", (): void => {
  // Mocks successful/ideal responses
  beforeEach((): void => {
    const mockCollection = {
      find: jest.fn(() => ({
        toArray: jest.fn().mockResolvedValue([]),
      })),
      insertOne: jest.fn().mockResolvedValue({ insertedId: "1" }),
    };
    const mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    (connectToDatabase as jest.Mock).mockResolvedValue(mockDb);
  });

  const roomName = "Test Room Name";
  const hostName = "Test Host Name";
  const password = "TestPassword123";
  let longString: string = "";
  for (let i = 0; i < 100; i++) {
    longString += "string";
  }

  describe("Error tests.", (): void => {
    describe("Validation errors.", (): void => {
      test("Should fail if roomName is missing.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/create-room")
          .send({
            hostName,
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Request must contain a room name, host name, and password.",
        });
      });
      test("Should fail if hostName is missing.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/create-room")
          .send({
            roomName,
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Request must contain a room name, host name, and password.",
        });
      });
      test("Should fail if password is missing.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/create-room")
          .send({
            roomName,
            hostName,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Request must contain a room name, host name, and password.",
        });
      });
      test("Should fail if roomName is not a string.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/create-room")
          .send({
            roomName: 1,
            hostName,
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Room name, host name, and password must all be strings.",
        });
      });
      test("Should fail if hostName is not a string.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/create-room")
          .send({
            roomName,
            hostName: 1,
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Room name, host name, and password must all be strings.",
        });
      });
      test("Should fail if password is not a string.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/create-room")
          .send({
            roomName,
            hostName,
            password: 1,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Room name, host name, and password must all be strings.",
        });
      });
      test("Should fail if roomName is too long.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/create-room")
          .send({
            roomName: longString,
            hostName,
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Room name, host name, or password is too long.",
        });
      });
      test("Should fail if hostName is too long.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/create-room")
          .send({
            roomName,
            hostName: longString,
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Room name, host name, or password is too long.",
        });
      });
      test("Should fail if password is too long.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/create-room")
          .send({
            roomName,
            hostName,
            password: longString,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Room name, host name, or password is too long.",
        });
      });
      test("Should fail if roomName is empty.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/create-room")
          .send({
            roomName: " ",
            hostName,
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Room name, host name, or password is empty.",
        });
      });
      test("Should fail if hostName is empty.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/create-room")
          .send({
            roomName,
            hostName: " ",
            password,
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Room name, host name, or password is empty.",
        });
      });
      test("Should fail if password is empty.", async (): Promise<void> => {
        const response: SupertestResponse = await request(server)
          .post("/api/create-room")
          .send({
            roomName,
            hostName,
            password: " ",
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: "Room name, host name, or password is empty.",
        });
      });
    });
    describe("Unexpected errors", (): void => {
      test("Should fail if connectToDatabase fails.", async (): Promise<void> => {
        (connectToDatabase as jest.Mock).mockRejectedValue(new Error());
        const response: SupertestResponse = await request(server)
          .post("/api/create-room")
          .send({
            roomName,
            hostName,
            password,
          });
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
          message: "Unknown error encountered while creating room.",
        });
      });
      test("Should fail if insertOne fails.", async (): Promise<void> => {
        const mockCollection = {
          find: jest.fn(() => ({
            toArray: jest.fn().mockResolvedValue([]),
          })),
          insertOne: jest.fn().mockRejectedValue(new Error()),
        };
        const mockDb = {
          collection: jest.fn().mockReturnValue(mockCollection),
        };
        (connectToDatabase as jest.Mock).mockResolvedValue(mockDb);
        const response: SupertestResponse = await request(server)
          .post("/api/create-room")
          .send({
            roomName,
            hostName,
            password,
          });
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
          message: "Unknown error encountered while creating room.",
        });
      });
    });
  });
  describe("Successful tests", (): void => {
    test("Should successfully return room details.", async (): Promise<void> => {
      consoleErrorSpy.mockRestore();
      const response: SupertestResponse = await request(server)
        .post("/api/create-room")
        .send({
          roomName,
          hostName,
          password,
        });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        message: "Room successfully created!",
        roomDetails: {
          roomId: expect.any(String),
          roomName,
          host: {
            name: hostName,
            userId: 0
          },
          password,
          users: [{
            name: hostName,
            userId: 0
          }],
          currentVideo: null,
          queue: [],
          createdAt: expect.any(String),
        },
      });
    });
  });
});
