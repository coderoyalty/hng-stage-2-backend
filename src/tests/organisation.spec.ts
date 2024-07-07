import { db } from "../db";
import request from "supertest";
import app from "../index";
import jwt from "jsonwebtoken";

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

describe("Organisation Access", () => {
  const userId = 1;

  const mockOrgs = [
    {
      userId: 1,
      orgId: 1,
      organisation: {
        orgId: 1,
        name: "John's Organisation",
        description: "John's default organisation",
      },
    },
    {
      userId: 1,
      orgId: 2,
      organisation: {
        orgId: 2,
        name: "Another Organisation",
        description: "Another organisation description",
      },
    },
  ];

  beforeAll(() => {
    const mockFindMany = jest.fn().mockResolvedValue(mockOrgs);

    jest
      .spyOn(db.query.usersToOrgs, "findMany")
      .mockImplementation(mockFindMany);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const accessToken = jwt.sign(
    { id: userId, email: "random@example.com" },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    },
  );

  describe("GET - /api/organisations", () => {
    it("should not fetch organisations the user does not have access to", async () => {
      const response = await request(app)
        .get(`/api/organisations`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe("GET - /api/organisations/:orgId", () => {
    it("should return 404 for none existing organisations", async () => {
      const mockWhere = jest.fn().mockReturnValue([]);
      const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
      const mockSelect = jest.fn().mockReturnValue({ from: mockFrom });

      jest.spyOn(db, "select").mockImplementationOnce(mockSelect);

      const orgId = 4;

      const response = await request(app)
        .get(`/api/organisations/${orgId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });

    it("should return 200 for existing organisations", async () => {
      const mockOrg = {
        orgId: 2,
        name: "Another Organisation",
        description: "Another organisation description",
      };

      const mockWhere = jest.fn().mockReturnValue([{ ...mockOrg }]);
      const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
      const mockSelect = jest.fn().mockReturnValue({ from: mockFrom });

      jest.spyOn(db, "select").mockImplementationOnce(mockSelect);

      const response = await request(app)
        .get(`/api/organisations/${mockOrg.orgId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("orgId", mockOrg.orgId);
      expect(response.body.data).toHaveProperty("name", mockOrg.name);
    });
  });
});
