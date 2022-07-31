import request from "supertest";
import loadApp from "../../src/loaders/app";
import { jest } from "@jest/globals";


describe("auth", () => {
  it.only("Should", async () => {
    const app = request(await loadApp());
    const l = await app.post("/api/auth/register").type("json").send({
      email: "admin@admin.com",
      password: "admin",
    })
    expect(l.statusCode).toBe(200)
  });
  it("Should", () => {
    expect(2).toBe(2);
  });
  it("Should", () => {
    expect(2).toBe(3);
  });
});
