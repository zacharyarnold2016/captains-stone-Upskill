/* eslint-disable no-underscore-dangle */
// @ts-nocheck
import { jest } from "@jest/globals";
import http_mocks from "node-mocks-http";
import events from "events";
import {
  getOneUser,
  updateUser,
  deleteUser,
  cv,
} from "../../src/controllers/users";
import { User } from "../../src/models/user.model";
import RedisService from "../../src/services/redis.service";

jest.mock("../../src/services/redis.service");
jest.mock("../../src/models/user.model");
const mockedUser = jest.mocked(User, true);
const mockedRedis = jest.mocked(RedisService, true);

const mockDb = [
  { id: 1, str: "Dummy" },
  { id: 2, str: "Dummy2" },
  { id: 3, str: "Dummy3" },
  { id: 4, str: "Dummy4" },
  { id: 5, str: "Dummy5" },
  { id: 6, str: "Dummy6" },
];

function buildResponse() {
  return http_mocks.createResponse({
    eventEmitter: events.EventEmitter,
  });
}

describe("User Controller: Testing Response Code Formats", () => {
  beforeAll(() => {
    mockedRedis.clearCache.mockImplementation(() => {
      console.log("Here thar be Redis");
    });
    mockedRedis.setCache.mockImplementation(() => {
      console.log("Redis Set");
    });
  });

  afterAll(() => {
    jest.unmock("../../src/services/redis.service");
    jest.unmock("../../src/models/user.model");
  });
  describe("getOneUser", () => {
    it("Should, Given Correct input, return User and status 200", async () => {
      mockedUser.findOne.mockImplementationOnce(async () => mockDb[0]);

      let data;
      let stat;

      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        body: {
          id: 1,
          user_id: 1,
          company_name: "epam",
          role: "admin",
          startDate: 1,
          endDate: 1,
          description: "Yo",
        },
        params: {
          id: 1,
        },
      });

      response.on("end", () => {
        data = response._getData();
        stat = response._getStatusCode();
      });

      await getOneUser(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ user: mockDb[0] });
      expect(stat).toBe(200);
    });
    it("Should respond with an error message and 404 if no user is found", async () => {
      mockedUser.findOne.mockImplementationOnce(async () => false);

      let data;
      let stat;

      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        body: {
          id: 1,
          user_id: 1,
          company_name: "epam",
          role: "admin",
          startDate: 1,
          endDate: 1,
          description: "Yo",
        },
      });

      response.on("end", () => {
        data = response._getData();
        stat = response._getStatusCode();
      });

      await getOneUser(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: `No User Found!`,
      });
      expect(stat).toBe(404);
    });
    it("Should respond with a 505 internal error if error thrown", async () => {
      mockedUser.findOne.mockImplementationOnce(async () => {
        throw new Error("Error");
      });

      let data;
      let stat;

      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        params: {
          id: 1,
          user_id: 1,
          company_name: "epam",
          role: "admin",
          startDate: 1,
          endDate: 1,
          description: "Yo",
        },
      });

      response.on("end", () => {
        data = response._getData();
        stat = response._getStatusCode();
      });

      await getOneUser(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: `Error`,
      });
      expect(stat).toBe(505);
    });
  });

  describe("updateUser", () => {
    it("It should respond with 200 OK and Updated User on golden path", async () => {
      // Avoids Database Contamination from Tests
      mockedUser.findOne.mockImplementationOnce(async () => {
        const ret = { user_id: 1 };
        return ret;
      });
      mockedUser.update.mockImplementationOnce(async () => mockDb[0]);
      mockedUser.findOne.mockImplementationOnce(async () => "Filler");

      let data;
      let stat;

      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        body: {
          id: 1,
          user_id: 1,
          company_name: "epam",
          role: "admin",
          startDate: 1,
          endDate: 1,
          description: "Yo",
        },
      });

      response.on("end", () => {
        data = response._getData();
        stat = response._getStatusCode();
      });

      await updateUser(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        user: "Filler",
      });
      expect(stat).toBe(200);
    });

    it("It should respond with 404 and Error Message When no User is found", async () => {
      // Avoids Database Contamination from Tests
      mockedUser.findOne.mockImplementationOnce(async () => false);

      let data;
      let stat;

      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        body: {
          id: 1,
          user_id: 1,
          company_name: "epam",
          role: "admin",
          startDate: 1,
          endDate: 1,
          description: "Yo",
        },
      });

      response.on("end", () => {
        data = response._getData();
        stat = response._getStatusCode();
      });

      await updateUser(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "No User Found",
      });
      expect(stat).toBe(404);
    });

    it("It should respond with 505 and Error Message When an unknown error is thrown", async () => {
      // Avoids Database Contamination from Tests
      mockedUser.findOne.mockImplementationOnce(async () => {
        throw new Error("Error");
      });

      let data;
      let stat;

      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        body: {
          id: 1,
          user_id: 1,
          company_name: "epam",
          role: "admin",
          startDate: 1,
          endDate: 1,
          description: "Yo",
        },
      });

      response.on("end", () => {
        data = response._getData();
        stat = response._getStatusCode();
      });

      await updateUser(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "Error",
      });
      expect(stat).toBe(505);
    });
  });

  describe("deleteUser", () => {
    it("Should respond with 200 ok and success message on successful deletion", async () => {
      mockedUser.findOne.mockImplementationOnce(async () => 1);
      mockedUser.destroy.mockImplementationOnce(async () => 1);

      let data;
      let stat;

      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        body: {
          id: 1,
          user_id: 1,
          company_name: "epam",
          role: "admin",
          startDate: 1,
          endDate: 1,
          description: "Yo",
        },
      });

      response.on("end", () => {
        data = response._getData();
        console.log(data);
        stat = response._getStatusCode();
      });

      await deleteUser(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        message: "deleted",
      });
      expect(stat).toBe(200);
    });

    it("Should respond with 404 and error message on no User found", async () => {
      mockedUser.findOne.mockImplementationOnce(async () => false);

      let data;
      let stat;

      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        body: {
          id: 1,
          user_id: 1,
          company_name: "epam",
          role: "admin",
          startDate: 1,
          endDate: 1,
          description: "Yo",
        },
      });

      response.on("end", () => {
        data = response._getData();
        console.log(data);
        stat = response._getStatusCode();
      });

      await deleteUser(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "User not found!",
      });
      expect(stat).toBe(404);
    });

    it("Should respond with 505 and error message on unknown Error", async () => {
      mockedUser.findOne.mockImplementationOnce(async () => {
        throw new Error("Error");
      });

      let data;
      let stat;

      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        body: {
          id: 1,
          user_id: 1,
          company_name: "epam",
          role: "admin",
          startDate: 1,
          endDate: 1,
          description: "Yo",
        },
      });

      response.on("end", () => {
        data = response._getData();
        console.log(data);
        stat = response._getStatusCode();
      });

      await deleteUser(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "Error",
      });
      expect(stat).toBe(505);
    });
  });

  describe("cv", () => {
    it("Should respond with 404 and error message on no User found", async () => {
      mockedUser.findOne.mockImplementationOnce(async () => false);

      let data;
      let stat;

      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        body: {
          id: 1,
          user_id: 1,
          company_name: "epam",
          role: "admin",
          startDate: 1,
          endDate: 1,
          description: "Yo",
        },
      });

      response.on("end", () => {
        data = response._getData();
        console.log(data);
        stat = response._getStatusCode();
      });

      await deleteUser(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "User not found!",
      });
      expect(stat).toBe(404);
    });

    it("Should respond with 505 and error message on unknown Error", async () => {
      mockedUser.findOne.mockImplementationOnce(async () => {
        throw new Error("Error");
      });

      let data;
      let stat;

      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        body: {
          id: 1,
          user_id: 1,
          company_name: "epam",
          role: "admin",
          startDate: 1,
          endDate: 1,
          description: "Yo",
        },
      });

      response.on("end", () => {
        data = response._getData();
        console.log(data);
        stat = response._getStatusCode();
      });

      await deleteUser(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "Error",
      });
      expect(stat).toBe(505);
    });
  });
});
