import loadApp from "../../src/loaders/app";
import request from "supertest";

describe("It Should", () => {
  it("SHould", async () => {
    const app = request(await loadApp());
    expect(1).toBe(1);
  });
});
