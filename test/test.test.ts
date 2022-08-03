import assert from "assert";
import loadApp from "../src/loaders/app";
import request from "supertest";

describe("app", async () => {
  const app = request(await loadApp());

  it("should", async () => {
    const a = await app.post("/api/auth/login").expect("Content-Type", /json/);
    const {body} = a
    const {status} = a
    console.log(body)
    assert.strictEqual(status, 400);
  });
});
