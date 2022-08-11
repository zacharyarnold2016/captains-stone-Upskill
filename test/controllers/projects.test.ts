/* eslint-disable no-underscore-dangle */
// @ts-nocheck
import { jest } from "@jest/globals";
import http_mocks from "node-mocks-http";
import events from "events";
import {
  createProject,
  getAllProjects,
  getOneProject,
  updateOneProject,
  deleteProject,
} from "../../src/controllers/projects";
import { Project } from "../../src/models/project.model";
import RedisService from "../../src/services/redis.service";

jest.mock("../../src/services/redis.service");
jest.mock("../../src/models/project.model");
const mockedProject = jest.mocked(Project, true);
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

describe("Project Controller: Testing Response Code Formats", () => {
  beforeAll(() => {
    mockedRedis.clearCache.mockImplementation(() => {
      console.log("Here thar be Redis");
    });
  });

  afterAll(() => {
    jest.unmock("../../src/services/redis.service");
    jest.unmock("../../src/models/project.model");
  });

  describe("Add Project", () => {
    it("Should return 200 and a project follwing golden path", async () => {
      let data;
      let stat;
      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        body: {
          user_id: 1,
          description: "Desc",
        },
        file: {
          path: "path",
        },
      });
      mockedProject.create.mockReturnValueOnce(request.body);
      response.on("end", () => {
        data = response._getData();
        stat = response._getStatusCode();
      });

      // @ts-ignore
      await createProject(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ project: request.body });
      expect(stat).toBe(200);
    });

    it("Should fail with 505 code if error occurs", async () => {
      let data;
      let stat;
      const response = buildResponse();
      const request = http_mocks.createRequest({
        method: "POST",
        url: "Filler",
        body: {
          user_id: 1,
          description: "Desc",
        },
        file: {
          path: "path",
        },
      });
      mockedProject.create.mockImplementationOnce(() => {
        throw Error("Error");
      });
      response.on("end", () => {
        data = response._getData();
        stat = response._getStatusCode();
      });

      // @ts-ignore
      await createProject(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ error: "Error" });
      expect(stat).toBe(505);
    });
  });

  describe("getAllProjects", () => {
    it("Should respond with an Error Message and a 505", async () => {
      mockedProject.findAndCountAll.mockImplementationOnce(async () => {
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

      await getAllProjects(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ error: "Error" });
      expect(stat).toBe(505);
    });

    it("Should return 404 error message if no experiences are found", async () => {
      mockedProject.findAll.mockImplementationOnce(async () => false);

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

      await getAllProjects(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ error: "No Projects Found!" });
      expect(stat).toBe(404);
    });
  });

  describe("getOneProject", () => {
    it("Should, Given Correct input, return Project and status 200", async () => {
      mockedProject.findOne.mockImplementationOnce(async () => mockDb[0]);

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

      await getOneProject(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({ project: mockDb[0] });
      expect(stat).toBe(200);
    });
    it("Should respond with an error message and 404 if no user is found", async () => {
      mockedProject.findOne.mockImplementationOnce(async () => false);

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

      await getOneProject(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: `No Project Found!`,
      });
      expect(stat).toBe(404);
    });
    it("Should respond with a 505 internal error if error thrown", async () => {
      mockedProject.findOne.mockImplementationOnce(async () => {
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

      await getOneProject(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: `Error`,
      });
      expect(stat).toBe(505);
    });
  });

  describe("updateOneProject", () => {
    it("It should respond with 200 OK and Updated User on golden path", async () => {
      // Avoids Database Contamination from Tests
      mockedProject.findOne.mockImplementationOnce(async () => {
        const ret = { user_id: 1 };
        return ret;
      });
      mockedProject.update.mockImplementationOnce(async () => mockDb[0]);
      mockedProject.findOne.mockImplementationOnce(async () => "Filler");

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

      await updateOneProject(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        project: "Filler",
      });
      expect(stat).toBe(200);
    });

    it("It should respond with 404 and Error Message When no Project is found", async () => {
      // Avoids Database Contamination from Tests
      mockedProject.findOne.mockImplementationOnce(async () => false);

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

      await updateOneProject(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "Project not Found",
      });
      expect(stat).toBe(404);
    });

    it("It should respond with 505 and Error Message When an unknown error is thrown", async () => {
      // Avoids Database Contamination from Tests
      mockedProject.findOne.mockImplementationOnce(async () => {
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

      await updateOneProject(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "Error",
      });
      expect(stat).toBe(505);
    });
  });

  describe("deleteProject", () => {
    it("Should respond with 200 ok and success message on successful deletion", async () => {
      mockedProject.findOne.mockImplementationOnce(async () => 1);
      mockedProject.destroy.mockImplementationOnce(async () => 1);

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

      await deleteProject(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        message: "deleted",
      });
      expect(stat).toBe(200);
    });

    it("Should respond with 404 and error message on no Project found", async () => {
      mockedProject.findOne.mockImplementationOnce(async () => false);

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

      await deleteProject(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "Project not found!",
      });
      expect(stat).toBe(404);
    });

    it("Should respond with 505 and error message on unknown Error", async () => {
      mockedProject.findOne.mockImplementationOnce(async () => {
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

      await deleteProject(request, response);

      const a = JSON.parse(data);

      expect(a).toStrictEqual({
        error: "Error",
      });
      expect(stat).toBe(505);
    });
  });
});
