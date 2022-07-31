/* eslint-disable no-underscore-dangle */
// @ts-nocheck
import { jest } from "@jest/globals";
import http_mocks from "node-mocks-http";
import events from "events";
import bcrypt from "bcrypt";
import register from "../../src/controllers/register";
import { User } from "../../src/models/user.model";

jest.mock("../../src/models/user.model");
jest.mock("bcrypt");
const mockedUser = jest.mocked(User, true);
const mockedBcrypt = jest.mocked(bcrypt, true);

function buildResponse() {
  return http_mocks.createResponse({
    eventEmitter: events.EventEmitter,
  });
}

describe("User Registration Controller", () => {
  afterAll(() => {
    jest.unmock("bcrypt");
  });

  it("Should return 200 ok and the new User on golden path", async () => {
    mockedBcrypt.hash.mockImplementationOnce(async () => "Password");
    mockedUser.create.mockImplementationOnce(async () => ({
      id: 1,
      value: 1,
    }));

    let data;
    let stat;
    const response = buildResponse();
    const request = http_mocks.createRequest({
      method: "POST",
      url: "Filler",
      body: {
        firstName: "TEST",
        lastName: "TESTER",
        title: "TESTING",
        summary: "THIS GUY TESTS",
        role: "ADMIN",
        email: "tester@test.com",
        password: "MuchTest",
      },
      file: "Fill",
    });

    response.on("end", () => {
      data = response._getData();
      stat = response._getStatusCode();
      console.log(data);
    });

    await register(request, response);
    const a = JSON.parse(data);

    expect(a).toStrictEqual({
      id: 1,
      firstName: "TEST",
      lastName: "TESTER",
      title: "TESTING",
      summary: "THIS GUY TESTS",
      email: "tester@test.com",
    });
    expect(stat).toBe(200);
  });

  it("Should return 400 and an Error Message given Error during user creation", async () => {
    mockedBcrypt.hash.mockImplementationOnce(async () => 1);
    mockedUser.create.mockImplementationOnce(async () => {
      throw new Error("Error");
    });
    let data;
    let stat;
    const response = buildResponse();
    const request = http_mocks.createRequest({
      method: "POST",
      url: "Filler",
      body: {
        firstName: "TEST",
        lastName: "TESTER",
        title: "TESTING",
        summary: "THIS GUY TESTS",
        role: "ADMIN",
        email: "tester@test.com",
        password: "MuchTest",
      },
      file: "Fill",
    });

    response.on("end", () => {
      data = response._getData();
      stat = response._getStatusCode();
    });

    await register(request, response);

    const a = JSON.parse(data);

    expect(a).toStrictEqual({
      error: "Error",
    });
    expect(stat).toBe(400);
  });
  it("Should return 505 ok and Error Message given Internal Error", async () => {
    mockedBcrypt.hash.mockImplementationOnce(async () => {
      throw new Error("Error");
    });
    let data;
    let stat;
    const response = buildResponse();
    const request = http_mocks.createRequest({
      method: "POST",
      url: "Filler",
      body: {
        firstName: "TEST",
        lastName: "TESTER",
        title: "TESTING",
        summary: "THIS GUY TESTS",
        role: "ADMIN",
        email: "tester@test.com",
        password: "MuchTest",
      },
      file: "Fill",
    });

    response.on("end", () => {
      data = response._getData();
      stat = response._getStatusCode();
    });

    await register(request, response);

    const a = JSON.parse(data);

    expect(a).toStrictEqual({
      error: "Error",
    });
    expect(stat).toBe(505);
  });
});
