import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import AuthService from "../../src/services/auth.service";

jest.mock("jsonwebtoken");
const mockedJwt = jest.mocked(jwt, true);

describe("JWT Authorization Service", () => {
  beforeAll(() => {
    mockedJwt.decode.mockReturnValue({
      user: {
        id: 1,
        role: "ADMIN",
      },
    });
  });

  afterAll(() => {
    jest.unmock("jsonwebtoken");
  });

  describe("AuthService.decodeId", () => {
    it("Should, Given input return an id of 1", async () => {
      const data = await AuthService.decodeId("x");
      expect(data).toEqual(1);
    });
    it("Should, Give no Input, Return an error", async () => {
      try {
        await AuthService.decodeId();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe("AuthService.decodeBody", () => {
    it("Should, Given Input, return the whole User", async () => {
      const data = await AuthService.decodeBody("x");
      expect(data).toEqual({
        id: 1,
        role: "ADMIN",
      });
    });
    it("Should, Given no Input, Return an error", async () => {
      try {
        await AuthService.decodeBody();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe("AuthService.decodeRole", () => {
    it("Should, Given input, return the role field when called", async () => {
      const data = await AuthService.decodeRole("x");
      expect(data).toEqual("ADMIN");
    });
    it("Should, Given no Input, Return an error", async () => {
      try {
        await AuthService.decodeRole();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });
});
