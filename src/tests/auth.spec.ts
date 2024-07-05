import request from "supertest";
import app from "../index";

describe("Authentication Route", () => {
  let server: any;

  const invalidData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "Password123", // password doesn't contain symbol
    phone: "1234567890",
  };

  const validData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "Password123!",
    phone: "1234567890",
  };

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  it("should respond with a 422 response", async () => {
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

  it("should respond with 201 response and return payload for now", async () => {
    const response = await request(app).post("/auth/register").send(validData);
    expect(response.status).toBe(201);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toStrictEqual(validData); //TODO: omit when the data is saved to a DB
  });
});
