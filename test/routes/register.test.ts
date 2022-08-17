import assert from "assert";
import loadApp from "../../src/loaders/app";
import request from "supertest";
import { User } from "../../src/models/user.model";

describe("app registration", async () => {
  const app = await loadApp();
  const superTest = request(app);

  const server = app.listen();

  it("Should Pass through all validation and return 200 Ok on a successful run", async () => {
    const testReq = await superTest
      .post("/api/auth/register")
      .field("firstName", "Zach")
      .field("lastName", "Arnold")
      .field("title", "string")
      .field("summary", "another one")
      .field("role", "USER")
      .field("email", "mitch@email.com")
      .field("password", "password")
      .attach("image", "public/test/Let.jpeg");
    // @ts-ignore
    const { body } = testReq;
    const { status } = testReq;
    assert.strictEqual(status, 200);
    await User.destroy({
      where: {
        email: "mitch@email.com",
      },
    });
  });

  it("Should return a censored version of the User upon a successful run", async () => {
    const testReq = await superTest
      .post("/api/auth/register")
      .field("firstName", "Zach")
      .field("lastName", "Arnold")
      .field("title", "string")
      .field("summary", "another one")
      .field("role", "USER")
      .field("email", "mitch@email.com")
      .field("password", "password")
      .attach("image", "public/test/Let.jpeg");
    const { body } = testReq;
    const { id, image } = body;
    const { status } = testReq;
    assert.deepStrictEqual(body, {
      id,
      firstName: "Zach",
      lastName: "Arnold",
      title: "string",
      summary: "another one",
      email: "mitch@email.com",
      image,
    });
  });

  it("Should return a 400 Bad Request if field (firstName) does not pass validation", async () => {
    const testReq = await superTest
      .post("/api/auth/register")
      .field("firstName", "")
      .field("lastName", "Arnold")
      .field("title", "string")
      .field("summary", "another one")
      .field("role", "USER")
      .field("email", "mitch@email.com")
      .field("password", "password")
      .attach("image", "public/test/Let.jpeg");
    const { status } = testReq;
    assert.strictEqual(status, 400);
  });
  it("Should return a 400 Bad Request if field (lastName) does not pass validation", async () => {
    const testReq = await superTest
      .post("/api/auth/register")
      .field("firstName", "Zach")
      .field("lastName", "")
      .field("title", "string")
      .field("summary", "another one")
      .field("role", "USER")
      .field("email", "mitch@email.com")
      .field("password", "password")
      .attach("image", "public/test/Let.jpeg");
    const { status } = testReq;
    assert.strictEqual(status, 400);
  });
  it("Should return a 400 Bad Request if field (title) does not pass validation", async () => {
    const testReq = await superTest
      .post("/api/auth/register")
      .field("firstName", "Zach")
      .field("lastName", "Arnold")
      .field("title", "")
      .field("summary", "another one")
      .field("role", "USER")
      .field("email", "mitch@email.com")
      .field("password", "password")
      .attach("image", "public/test/Let.jpeg");
    const { status } = testReq;
    assert.strictEqual(status, 400);
  });
  it("Should return a 400 Bad Request if field (summary) does not pass validation", async () => {
    const testReq = await superTest
      .post("/api/auth/register")
      .field("firstName", "Zach")
      .field("lastName", "Arnold")
      .field("title", "string")
      .field("summary", "")
      .field("role", "USER")
      .field("email", "mitch@email.com")
      .field("password", "password")
      .attach("image", "public/test/Let.jpeg");
    const { status } = testReq;
    assert.strictEqual(status, 400);
  });
  it("Should return a 400 Bad Request if field (role) does not pass validation", async () => {
    const testReq = await superTest
      .post("/api/auth/register")
      .field("firstName", "Zach")
      .field("lastName", "Arnold")
      .field("title", "string")
      .field("summary", "another one")
      .field("role", "user")
      .field("email", "mitch@email.com")
      .field("password", "password")
      .attach("image", "public/test/Let.jpeg");
    const { status } = testReq;
    assert.strictEqual(status, 400);
  });
  it("Should return a 400 Bad Request if field (password) does not pass validation", async () => {
    const testReq = await superTest
      .post("/api/auth/register")
      .field("firstName", "Zach")
      .field("lastName", "Arnold")
      .field("title", "string")
      .field("summary", "another one")
      .field("role", "USER")
      .field("email", "mitch@email.com")
      .field("password", "")
      .attach("image", "public/test/Let.jpeg");
    const { status } = testReq;
    assert.strictEqual(status, 400);
  });
  // error should be thrown by multer as opposed to validation.
  it("Should return a 505 Bad Request if field (image) does not pass validation", async () => {
    const testReq = await superTest
      .post("/api/auth/register")
      .field("firstName", "Zach")
      .field("lastName", "Arnold")
      .field("title", "string")
      .field("summary", "another one")
      .field("role", "USER")
      .field("email", "mitch@email.com")
      .field("password", "password");
    const { status } = testReq;
    assert.strictEqual(status, 505);
  });

  await User.destroy({
    where: {
      email: "mitch@email.com",
    },
  });

  server.close();
});
