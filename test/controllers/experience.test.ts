/* eslint-disable no-underscore-dangle */
// @ts-nocheck
import { jest } from "@jest/globals";
import http_mocks from "node-mocks-http";
import events from "events";
import { Json } from "sequelize/types/lib/utils";
import {
  addExperience,
  getAllExperience,
  getOneExperience,
  updateExperience,
  deleteExperience,
} from "../../src/controllers/experience";
import { Experience } from "../../src/models/experience.model";
import RedisService from "../../src/services/redis.service";

jest.mock("../../src/services/redis.service");
jest.mock("../../src/models/experience.model");
const mockedExperience = jest.mocked(Experience, true);
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

describe("Experience Controller: Testing Response Code Formats", () => {
  beforeAll(() => {
    mockedRedis.clearCache.mockImplementation(() => {
      console.log("Here thar be Redis");
    });
  });

  afterAll(() => {
    jest.unmock("../../src/services/redis.service");
    jest.unmock("../../src/models/experience.model");
  });

  describe("Add Experience", () => {
    it("Should, Given a request and response, respond with a value", async () => {
      let data;
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
      mockedExperience.create.mockReturnValueOnce(request.body);
      response.on("end", () => {
        data = response._getData();
      });

      // @ts-ignore
      await addExperience(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ experience: request.body });
    });

    it("Should, Given an error, respond with an error message", async () => {
      let data;
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
      mockedExperience.create.mockImplementationOnce(() => {
        throw Error("Error");
      });
      response.on("end", () => {
        data = response._getData();
      });

      // @ts-ignore
      await addExperience(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ error: "Error" });
    });
  });

  describe("getAllExperience", () => {
    it("Should respond with an Error Message and a 505", async () => {
      mockedExperience.findAndCountAll.mockImplementationOnce(async () => {
        throw Error("Error");
      });

      let data;
      let stat;
      const response = buildResponse();
      const request = http_mocks.createRequest({
        id: 1,
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

      await getAllExperience(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ error: "Error" });
    });

    it("Should return 404 error message if no experiences are found", async () => {
      mockedExperience.findAll.mockImplementationOnce(async () => false);

      let data;
      let stat;
      const response = buildResponse();
      const request = http_mocks.createRequest({
        id: 1,
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

      await getAllExperience(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ message: "Experiences not Found!" });
      expect(stat).toBe(404);
    });
  });

  describe("getOneExperience", () => {
    it("Should, Given Correct input, return Experience and status 200", async () => {
      mockedExperience.findOne.mockImplementationOnce(async () => mockDb[0]);

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

      await getOneExperience(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ experience: mockDb[0] });
      expect(stat).toBe(200);
    });
    it("Should respond with an error message and 404 if no user is found", async () => {
      mockedExperience.findOne.mockImplementationOnce(async () => false);

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

      await getOneExperience(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        message: `Experience not found!`,
      });
      expect(stat).toBe(404);
    });
    it("Should respond with a 505 internal error if error thrown", async () => {
      mockedExperience.findOne.mockImplementationOnce(async () => {
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

      await getOneExperience(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: `Error`,
      });
      expect(stat).toBe(505);
    });
  });

  describe("updateExperience", () => {
    it("It should respond with 200 OK and Updated User on golden path", async () => {
      // Avoids Database Contamination from Tests
      mockedExperience.findOne.mockImplementationOnce(async () => {
        const ret = { user_id: 1 };
        return ret;
      });
      mockedExperience.update.mockImplementationOnce(async () => mockDb[0]);
      mockedExperience.findOne.mockImplementationOnce(async () => "Filler");

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

      await updateExperience(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        experience: "Filler",
      });
      expect(stat).toBe(200);
    });

    it("It should respond with 404 and Error Message When no Experience is found", async () => {
      // Avoids Database Contamination from Tests
      mockedExperience.findOne.mockImplementationOnce(async () => false);

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

      await updateExperience(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "No Experience Found!",
      });
      expect(stat).toBe(404);
    });

    it("It should respond with 505 and Error Message When an unknown error is thrown", async () => {
      // Avoids Database Contamination from Tests
      mockedExperience.findOne.mockImplementationOnce(async () => {
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

      await updateExperience(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "Error",
      });
      expect(stat).toBe(505);
    });
  });

  describe("deleteExperience", () => {
    it("Should respond with 200 ok and success message on successful deletion", async () => {
      mockedExperience.findOne.mockImplementationOnce(async () => 1);
      mockedExperience.destroy.mockImplementationOnce(async () => 1);

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

      await deleteExperience(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        message: "deleted",
      });
      expect(stat).toBe(200);
    });

    it("Should respond with 404 and error message on no Experience found", async () => {
      mockedExperience.findOne.mockImplementationOnce(async () => false);

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

      await deleteExperience(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "Experience not found!",
      });
      expect(stat).toBe(404);
    });

    it("Should respond with 505 and error message on unknown Error", async () => {
      mockedExperience.findOne.mockImplementationOnce(async () => {
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

      await deleteExperience(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "Error",
      });
      expect(stat).toBe(505);
    });
  });
});
