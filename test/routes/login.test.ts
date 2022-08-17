import assert from "assert";
import loadApp from "../../src/loaders/app";
import request from "supertest";
import { User } from "../../src/models/user.model";

describe("app login", async () => {
  const app = await loadApp();
  const superTest = request(app);

  const server = app.listen();
  it("Should Pass through all validation and return 200 Ok on a successful run", async () => {
    console.log("We're in the File");
    await superTest
      .post("/api/auth/register")
      .field("firstName", "Zach")
      .field("lastName", "Arnold")
      .field("title", "string")
      .field("summary", "another one")
      .field("role", "USER")
      .field("email", "mitch@email.com")
      .field("password", "password")
      .attach("image", "public/test/Let.jpeg");
    console.log("We're in the loop");
    const testReq = await superTest.post("/api/auth/login").send({
      email: "mitch@email.com",
      password: "password",
    });

    const { body, status } = testReq;
    console.log(status);
    console.log(body);
    assert.strictEqual(status, 200);
  });

  it("Should return with a 403 error if password is incorrect", async () => {
    const testReq = await superTest.post("/api/auth/login").send({
      email: "mitch@email.com",
      password: "WordSpass",
    });

    const { body, status } = testReq;
    console.log(status);
    console.log(body);
    assert.strictEqual(status, 400);
    await User.destroy({
      where: {
        email: "mitch@email.com",
      },
    });
  });
  server.close();
});
