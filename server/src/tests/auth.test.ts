import request from "supertest";
import mongoose from "mongoose";
import app from "../index";

// Requires a running MongoDB instance (see docker-compose.yml) and env vars set.
// This is a template test to demonstrate the pattern, not a full suite.

describe("Auth flow", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("rejects login with invalid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@example.com",
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });

  it("registers a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test Operator",
      email: `test-${Date.now()}@example.com`,
      password: "correcthorsebattery",
      role: "operator",
    });
    expect(res.status).toBe(201);
    expect(res.body.role).toBe("operator");
  });
});
