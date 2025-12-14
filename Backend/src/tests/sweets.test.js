const request = require("supertest");

const app = require("../app");

async function tokenFor(email) {
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

describe("Sweets", () => {
  test("GET /api/sweets is protected", async () => {
    const res = await request(app).get("/api/sweets");
    expect(res.status).toBe(401);
  });

  test("can create and list sweets", async () => {
    const token = await tokenFor("user@example.com");

    const create = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Gulab Jamun",
        category: "Indian",
        price: 10,
        quantity: 5,
      });

    expect(create.status).toBe(201);
    expect(create.body.name).toBe("Gulab Jamun");

    const list = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBe(1);
  });

  test("rejects invalid price/quantity on create", async () => {
    const token = await tokenFor("user@example.com");

    const badPrice = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Bad", category: "Test", price: "abc", quantity: 1 });

    expect(badPrice.status).toBe(400);

    const badQty = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Bad", category: "Test", price: 1, quantity: -1 });

    expect(badQty.status).toBe(400);
  });

  test("search supports name/category/price range", async () => {
    const token = await tokenFor("user@example.com");

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Ladoo", category: "Indian", price: 5, quantity: 10 });

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Brownie", category: "Baked", price: 25, quantity: 3 });

    const res = await request(app)
      .get("/api/sweets/search?category=indian&minPrice=1&maxPrice=10")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Ladoo");
  });

  test("search rejects invalid minPrice/maxPrice", async () => {
    const token = await tokenFor("user@example.com");

    const res = await request(app)
      .get("/api/sweets/search?minPrice=abc")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});
