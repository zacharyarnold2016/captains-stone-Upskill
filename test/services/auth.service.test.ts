import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
// import AuthService from "../../src/services/auth.service";

describe("Test", () => {
  it("Should be 1", () => {
    jest.mock("jwt");
    // jwt.decode.mockReturnValue(1);
    expect(1).toBe(1);
  });
});
