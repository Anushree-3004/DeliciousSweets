const request = require("supertest");

const app = require("../app");

describe("Auth", () => {
  test("unknown route returns consistent 404 error shape", async () => {
    const res = await request(app).get("/api/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatchObject({
      status: 404,
      code: "NOT_FOUND",
    });
  });

  test("register creates a normal user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("alice@example.com");
    expect(res.body.role).toBe("user");
    expect(res.body).toHaveProperty("id");
  });

  test("register assigns admin role if email matches ADMIN_EMAIL", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Admin",
      email: "admin@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.role).toBe("admin");
  });

  test("login returns a token and role", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Bob",
      email: "bob@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "bob@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.role).toBe("user");
  });

  test("login rejects invalid credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Bob",
      email: "bob@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "bob@example.com",
      password: "wrong",
    });

    expect(res.status).toBe(401);
  });
});