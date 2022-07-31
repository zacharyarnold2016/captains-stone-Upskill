// @ts-nocheck
import { jest } from "@jest/globals";
import events from "events";
import http_mocks from "node-mocks-http";
import reqLogger from "../../src/middleware/requestLog";
import logger from "../../src/libs/logger";

const spy = jest.spyOn(logger, "info");

function buildResponse() {
  return http_mocks.createResponse({
    eventEmitter: events.EventEmitter,
  });
}

describe("Logger Test", () => {
  const response = buildResponse();
  const request = http_mocks.createRequest({
    method: "POST",
    url: "Filler",
    query: {
      token: "Token",
    },
    id: 1,
  });
  const next = () => {
    console.log("next");
  };

  it("Should call the logger function", async () => {
    reqLogger(request, response, next);

    expect(spy).toBeCalled();
  });
});
