import request from "supertest";
import app from "../index";

// Mock dotenv
jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

describe("Authentication Endpoints", () => {
  let server: any;

  const invalidData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "Password123", // password doesn't contain symbol
    phone: "1234567890",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  describe("POST /auth/register", () => {
    it("should return 422 if validation fails", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send(invalidData);
      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
      const passwordError = response.body.errors.find(
        (error: { field: string }) => error.field === "password",
      );

      expect(passwordError).toBeDefined();
    });
  });
});
