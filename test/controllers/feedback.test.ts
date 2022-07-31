/* eslint-disable no-underscore-dangle */
// @ts-nocheck
import { jest } from "@jest/globals";
import http_mocks from "node-mocks-http";
import events from "events";
import {
  addFeedback,
  getAllFeedback,
  getOneFeedback,
  updateFeedback,
  deleteFeedback,
} from "../../src/controllers/feedback";
import { Feedback } from "../../src/models/feedback.model";
import RedisService from "../../src/services/redis.service";

jest.mock("../../src/services/redis.service");
jest.mock("../../src/models/feedback.model");
const mockedFeedback = jest.mocked(Feedback, true);
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

describe("Feedback Controller: Testing Response Code Formats", () => {
  beforeAll(() => {
    mockedRedis.clearCache.mockImplementation(() => {
      console.log("Here thar be Redis");
    });
  });

  afterAll(() => {
    jest.unmock("../../src/services/redis.service");
    jest.unmock("../../src/models/feedback.model");
  });

  describe("Add Feedback", () => {
    it("Should return an object upon successful golden path", async () => {
      let data;
      let stat;
      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        body: {
          from_user: 1,
          to_user: 2,
          content: "BLah",
          company_name: "EPAM",
        },
      });
      mockedFeedback.create.mockReturnValueOnce(request.body);
      response.on("end", () => {
        data = response._getData();
        stat = response._getStatusCode();
      });

      // @ts-ignore
      await addFeedback(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ feedback: request.body });
      expect(stat).toBe(200);
    });

    it("Should, Given an error, respond with an error message", async () => {
      let data;
      let stat;
      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        body: {
          from_user: 1,
          to_user: 2,
          content: "BLah",
          company_name: "EPAM",
        },
      });
      mockedFeedback.create.mockImplementationOnce(() => {
        throw Error("Error");
      });
      response.on("end", () => {
        data = response._getData();
        stat = response._getStatusCode();
      });

      // @ts-ignore
      await addFeedback(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ error: "Error" });
      expect(stat).toBe(400);
    });
  });

  describe("getAllFeedback", () => {
    it("Should respond with an Error Message and a 505", async () => {
      mockedFeedback.findAndCountAll.mockImplementationOnce(async () => {
        throw Error("Error");
      });

      let data;
      let stat;
      const response = buildResponse();
      const request = http_mocks.createRequest({
        id: 1,
        method: "POST",
        url: "Filler",
      });

      response.on("end", () => {
        data = response._getData();
        stat = response._getStatusCode();
      });

      await getAllFeedback(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ error: "Error" });
      expect(stat).toBe(505);
    });

    it("Should return 404 error message if no feedbacks are found", async () => {
      mockedFeedback.findAll.mockImplementationOnce(async () => false);

      let data;
      let stat;
      const response = buildResponse();
      const request = http_mocks.createRequest({
        id: 1,
        method: "POST",
        url: "Filler",
      });

      response.on("end", () => {
        data = response._getData();
        stat = response._getStatusCode();
      });

      await getAllFeedback(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ error: "No Feedback Found!" });
      expect(stat).toBe(404);
    });
  });

  describe("getOneFeedback", () => {
    it("Should, Given Correct input, return Feedback and status 200", async () => {
      mockedFeedback.findOne.mockImplementationOnce(async () => mockDb[0]);

      let data;
      let stat;

      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        params: {
          id: 1,
        },
      });

      response.on("end", () => {
        data = response._getData();
        stat = response._getStatusCode();
      });

      await getOneFeedback(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ feedback: mockDb[0] });
      expect(stat).toBe(200);
    });
    it("Should respond with an error message and 404 if no user is found", async () => {
      mockedFeedback.findOne.mockImplementationOnce(async () => false);

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

      await getOneFeedback(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: `Feedback not found!`,
      });
      expect(stat).toBe(404);
    });
    it("Should respond with a 505 internal error if error thrown", async () => {
      mockedFeedback.findOne.mockImplementationOnce(async () => {
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

      await getOneFeedback(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: `Error`,
      });
      expect(stat).toBe(505);
    });
  });

  describe("updateFeedback", () => {
    it("It should respond with 200 OK and Updated User on golden path", async () => {
      // Avoids Database Contamination from Tests
      mockedFeedback.findOne.mockImplementationOnce(async () => {
        const ret = { user_id: 1 };
        return ret;
      });
      mockedFeedback.update.mockImplementationOnce(async () => mockDb[0]);
      mockedFeedback.findOne.mockImplementationOnce(async () => "Filler");

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

      await updateFeedback(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        feedback: "Filler",
      });
      expect(stat).toBe(200);
    });

    it("It should respond with 404 and Error Message When no Feedback is found", async () => {
      // Avoids Database Contamination from Tests
      mockedFeedback.findOne.mockImplementationOnce(async () => false);

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

      await updateFeedback(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "No Feedback Found!",
      });
      expect(stat).toBe(404);
    });

    it("It should respond with 505 and Error Message When an unknown error is thrown", async () => {
      // Avoids Database Contamination from Tests
      mockedFeedback.findOne.mockImplementationOnce(async () => {
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

      await updateFeedback(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "Error",
      });
      expect(stat).toBe(505);
    });
  });

  describe("deleteFeedback", () => {
    it("Should respond with 200 ok and success message on successful deletion", async () => {
      mockedFeedback.findOne.mockImplementationOnce(async () => 1);
      mockedFeedback.destroy.mockImplementationOnce(async () => 1);

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

      await deleteFeedback(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        message: "deleted",
      });
      expect(stat).toBe(200);
    });

    it("Should respond with 404 and error message on no Feedback found", async () => {
      mockedFeedback.findOne.mockImplementationOnce(async () => false);

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

      await deleteFeedback(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "Feedback not found!",
      });
      expect(stat).toBe(404);
    });

    it("Should respond with 505 and error message on unknown Error", async () => {
      mockedFeedback.findOne.mockImplementationOnce(async () => {
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

      await deleteFeedback(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "Error",
      });
      expect(stat).toBe(505);
    });
  });
});
