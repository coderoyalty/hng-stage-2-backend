import request from "supertest";
import app from "../index";
import { db } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    password: "", // password doesn't contain symbol
    phone: "1234567890",
  };

  const user = {
    ...invalidData,
    password: "Password123@",
  };

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  describe("POST /auth/register", () => {
    beforeAll(() => {
      const mockWhere = jest.fn().mockReturnValue([]);
      const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
      const mockSelect = jest.fn().mockReturnValue({ from: mockFrom });

      jest.spyOn(db, "select").mockImplementation(mockSelect);
      jest.spyOn(db, "transaction").mockImplementation(async (trx) => {
        return { id: 1, ...user };
      });
      jest.spyOn(bcrypt, "hash").mockResolvedValue(user.password as never);
    });

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

    it("should generate a token with correct user details and expiration time", async () => {
      const response = await request(app).post("/auth/register").send(user);

      expect(response.status).toBe(201);
      const { accessToken } = response.body.data;

      const decodedToken = jwt.verify(
        accessToken,
        process.env.JWT_SECRET!,
      ) as jwt.JwtPayload;

      expect(decodedToken).toHaveProperty("id", 1);
      expect(decodedToken).toHaveProperty("iat");
      expect(decodedToken).toHaveProperty("exp");

      const expiresIn = decodedToken.exp! - decodedToken.iat!;
      expect(expiresIn).toBe(3600); // 1 hour in seconds
    });
  });

  describe("POST /auth/login", () => {
    beforeAll(() => {
      jest.mock("dotenv", () => ({
        config: jest.fn(),
      }));

      jest.mock("bcrypt", () => ({
        compare: jest.fn(),
      }));

      jest.mock("jsonwebtoken", () => ({
        sign: jest.fn(),
      }));

      const mockWhere = jest.fn().mockReturnValue([{ ...user, id: 1 }]);
      const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
      const mockSelect = jest.fn().mockReturnValue({ from: mockFrom });

      jest.spyOn(db, "select").mockImplementation(mockSelect);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 422 if validation fails", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "random@example.com" });
      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
      const passwordError = response.body.errors.find(
        (error: { field: string }) => error.field === "password",
      );

      expect(passwordError).toBeDefined();
    });

    it("should login a user successfully", async () => {
      jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => true);
      const response = await request(app)
        .post("/auth/login")
        .send({ password: user.password, email: user.email });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("accessToken");
    });

    it("should not login because of an invalid password", async () => {
      jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => false);

      const response = await request(app)
        .post("/auth/login")
        .send({ password: "Abcd123@", email: user.email });

      expect(response.status).toBe(401);
    });
  });
});
