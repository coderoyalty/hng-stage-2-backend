import request from "supertest";
import app from "../index";

describe("Express App", () => {
  let server: any;
  beforeAll(() => {
    server = app.listen(0);
  });
  afterAll(() => {
    server.close();
  });
  it("should respond with a status endpoint", async () => {
    const response = await request(app).get("/api/status");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("The service is alive, and active!");
    expect(response.body.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should redirect from / to https://coderoyalty.vercel.app", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("https://coderoyalty.vercel.app");
  });

  it("should respond with 404 for unknown endpoints", async () => {
    const response = await request(app).get("/unknown-route");
    expect(response.status).toBe(404);
  });
});
