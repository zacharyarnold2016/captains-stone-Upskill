// @ts-nocheck
import { jest } from "@jest/globals";
import http_mocks from "node-mocks-http";
import events from "events";
import logger from "../../src/libs/logger";
import errorHandler from "../../src/middleware/errorHandler";

function buildResponse() {
  return http_mocks.createResponse({
    eventEmitter: events.EventEmitter,
  });
}

describe("Error Handler", () => {
  let stat;
  let data;
  const response = buildResponse();
  const request = http_mocks.createRequest({
    method: "POST",
    url: "/api",
    id: 1,
  });
  const err = new Error("Error");

  const spy = jest.spyOn(logger, "error");
  afterAll(() => {
    jest.unmock("../../src/middleware/errorHandler");
  });

  it("Should call both the validate and decode functions", async () => {
    response.on("end", () => {
      data = response._getData();
      stat = response._getStatusCode();
    });
    errorHandler(err, request, response, () => 1);

    expect(data).toStrictEqual(err);
    expect(stat).toBe(500);
  });
});
