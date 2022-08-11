import assert from "assert";
import loadApp from "../../src/loaders/app";
import request from "supertest";
import { User } from "../../src/models/user.model";
import { Op } from "sequelize";

describe("app", async () => {
  const app = await loadApp();
  const superTest = request(app);

  const server = app.listen();
  it("Should Pass through all validation and return 200 Ok on a successful run", async () => {
    const a = await superTest
      .post("/api/auth/register")
      .field("firstName", "Zach")
      .field("lastName", "Arnold")
      .field("title", "string")
      .field("summary", "another one")
      .field("role", "USER")
      .field("email", "mitch@email.com")
      .field("password", "password")
      .attach("image", "public/test/Let.jpeg");
    const { body } = a;
    const { status } = a;
    assert.strictEqual(status, 200);
    await User.destroy({
      where: {
        email: "mitch@email.com",
      },
    });
  });

  it("Should return a censored version of the User upon a successful run", async () => {
    const a = await superTest
      .post("/api/auth/register")
      .field("firstName", "Zach")
      .field("lastName", "Arnold")
      .field("title", "string")
      .field("summary", "another one")
      .field("role", "USER")
      .field("email", "mitch@email.com")
      .field("password", "password")
      .attach("image", "public/test/Let.jpeg");
    const { body } = a;
    console.log(body);
    const { id, image } = body;
    const { status } = a;
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
  await User.destroy({
    where: {
      email: "mitch@email.com",
    },
  });

  it("Should return a 400 Bad Request if field (firstName) does not pass validation", () => {});
  it("Should return a 400 Bad Request if field (lastName) does not pass validation", () => {});
  it("Should return a 400 Bad Request if field (title) does not pass validation", () => {});
  it("Should return a 400 Bad Request if field (summary) does not pass validation", () => {});
  it("Should return a 400 Bad Request if field (role) does not pass validation", () => {});
  it("Should return a 400 Bad Request if field (password) does not pass validation", () => {});
  it("Should return a 400 Bad Request if field (image) does not pass validation", () => {});

  server.close();
});
