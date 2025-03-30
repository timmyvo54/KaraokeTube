import { Server } from "http";
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

describe("POST /api/handshake tests.", (): void => {
  describe("Error tests.", (): void => {
    describe("Validation errors.", (): void => {
      test("Should fail if room code does not exist.", async (): Promise<void> => {});
      test("Should fail if auth cookie is missing.", async (): Promise<void> => {});
      test("Should fail if cookie does not contain necessary information.", async (): Promise<void> => {});
      test("Should fail if room ID from cookie does not match room code.", async (): Promise<void> => {});
      test("Should fail if room with code does not exist.", async (): Promise<void> => {});
      test("Should fail if room password is incorrect.", async (): Promise<void> => {});
      test("Should fail if user already exists in the room.", async (): Promise<void> => {});
    });
    describe("Unexpected errors.", (): void => {
      test("Should fail if connectToDatabase fails.", async (): Promise<void> => {});
    });
  });
  describe("Successful tests.", (): void => {
    test("Should successfully return a message.", async (): Promise<void> => {});
  });
});
