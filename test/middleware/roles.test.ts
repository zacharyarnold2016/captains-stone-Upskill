// @ts-nocheck
import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import http_mocks from "node-mocks-http";
import events from "events";

import { User } from "../../src/models/user.model";
import roles from "../../src/middleware/roles";

function buildResponse() {
  return http_mocks.createResponse({
    eventEmitter: events.EventEmitter,
  });
}
jest.mock("jsonwebtoken");
const mockedJwt = jest.mocked(jwt, true);
const spy = jest.spyOn(User, "validate");

describe("Role Validation", () => {
  // Only concern here is that the functions are being called
  it("Should call both the validate and decode functions", async () => {
    mockedJwt.decode.mockImplementation(() => ({ user: { role: "ADMIN" } }));
    const response = buildResponse();
    const request = http_mocks.createRequest({
      method: "POST",
      url: "Filler",
      query: {
        token: "Token",
      },
    });
    await roles(request, response);
    expect(mockedJwt.decode).toBeCalled();
    expect(spy).toBeCalled();
  });
});
