const request = require("supertest");

const app = require("../app");

async function registerAndLogin({ email }) {
  const password = "password123";

  await request(app).post("/api/auth/register").send({
    name: "User",
    email,
    password,
  });

  const login = await request(app).post("/api/auth/login").send({
    email,
    password,
  });

  return login.body.token;
}

describe("Inventory", () => {
  test("purchase decreases quantity", async () => {
    const token = await registerAndLogin({ email: "user@example.com" });

    const sweet = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Kaju Katli", category: "Indian", price: 30, quantity: 2 });

    const purchase = await request(app)
      .post(`/api/sweets/${sweet.body._id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 1 });

    expect(purchase.status).toBe(200);
    expect(purchase.body.quantity).toBe(1);
  });

  test("purchase rejects non-integer quantity", async () => {
    const token = await registerAndLogin({ email: "user@example.com" });

    const sweet = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Peda", category: "Indian", price: 10, quantity: 5 });

    const res = await request(app)
      .post(`/api/sweets/${sweet.body._id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 1.5 });

    expect(res.status).toBe(400);
  });

  test("purchase fails when insufficient stock", async () => {
    const token = await registerAndLogin({ email: "user@example.com" });

    const sweet = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Barfi", category: "Indian", price: 20, quantity: 1 });

    const purchase = await request(app)
      .post(`/api/sweets/${sweet.body._id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 2 });

    expect(purchase.status).toBe(400);
  });

  test("restock requires admin", async () => {
    const userToken = await registerAndLogin({ email: "user@example.com" });
    const adminToken = await registerAndLogin({ email: "admin@example.com" });

    const sweet = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Jalebi", category: "Indian", price: 15, quantity: 0 });

    const forbidden = await request(app)
      .post(`/api/sweets/${sweet.body._id}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 2 });

    expect(forbidden.status).toBe(403);

    const ok = await request(app)
      .post(`/api/sweets/${sweet.body._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 2 });

    expect(ok.status).toBe(200);
    expect(ok.body.quantity).toBe(2);
  });
});