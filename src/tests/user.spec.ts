import { db } from "../db";
import request from "supertest";
import app from "../index";
import jwt from "jsonwebtoken";

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

describe("User Record Access", () => {
  const userId = 1;

  const accessToken = jwt.sign(
    { id: userId, email: "random@example.com" },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    },
  );
  const mockUser = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
  };

  const mockOrgs = [
    {
      userId: mockUser.id,
      orgId: 1,
      organisation: {
        orgId: 1,
        name: "John's Organisation",
        description: "John's default organisation",
      },
    },
  ];

  beforeAll(() => {
    const mockFindMany = jest.fn().mockResolvedValue(mockOrgs);

    jest
      .spyOn(db.query.usersToOrgs, "findMany")
      .mockImplementation(mockFindMany);
  });

  describe("GET /api/users/:id", () => {
    it("should return a user record successfully", async () => {
      const mockWhere = jest.fn().mockReturnValue([mockUser]);
      const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
      const mockSelect = jest.fn().mockReturnValue({ from: mockFrom });

      jest.spyOn(db, "select").mockImplementationOnce(mockSelect);

      const response = await request(app)
        .get(`/api/users/${mockUser.id}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data.organisations).toBeDefined();
      expect(response.body.data.organisations).toHaveLength(mockOrgs.length);
    });

    it("should return 404 if the user does not exist", async () => {
      const mockWhere = jest.fn().mockReturnValue([]);
      const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
      const mockSelect = jest.fn().mockReturnValue({ from: mockFrom });

      jest.spyOn(db, "select").mockImplementationOnce(mockSelect);

      const response = await request(app)
        .get(`/api/users/${mockUser.id}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe("error");
    });
  });
});
