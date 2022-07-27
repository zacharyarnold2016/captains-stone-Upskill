import { getPagingData, getPagination } from "../../src/services/page.service";

describe("Pagination Service", () => {
  describe("getPagingData", () => {
    it("Should, Given { count: 1, rows: 1 }, 1, 1), Return calculated results", () => {
      expect(getPagingData({ count: 1, rows: 1 }, 1, 1)).toStrictEqual({
        totalItems: 1,
        data: { count: 1, rows: 1 },
        totalPages: 1,
        currentPage: 1,
      });
    });
    it("Should, Given { count: 2, rows: 2 }, 2, 2), Return calculated results", () => {
      expect(getPagingData({ count: 2, rows: 2 }, 2, 2)).toStrictEqual({
        totalItems: 2,
        data: { count: 2, rows: 2 },
        totalPages: 1,
        currentPage: 2,
      });
    });
    it("Should, Given { count: 0, rows: 0 }, 1, 1), Return calculated results", () => {
      expect(getPagingData({ count: 0, rows: 0 }, 1, 1)).toStrictEqual({
        totalItems: 0,
        data: { count: 0, rows: 0 },
        totalPages: 0,
        currentPage: 1,
      });
    });
    it("Should, Given { count: 1, rows: 1 }, 1, 1), Return calculated results", () => {
      expect(getPagingData({ count: 100, rows: 100 }, 5, 10)).toStrictEqual({
        totalItems: 100,
        data: { count: 100, rows: 100 },
        totalPages: 10,
        currentPage: 5,
      });
    });
    it("Should, Give numbers out of bounds, throw an Error", () => {
      expect(() =>
        getPagingData({ count: 100, rows: 100 }, -1, 1)
      ).toThrowError();
    });
    it("Should, Give numbers out of bounds, throw an Error", () => {
      expect(() =>
        getPagingData({ count: 100, rows: 100 }, 1, -1)
      ).toThrowError();
    });
    it("Should, Give numbers out of bounds, throw an Error", () => {
      expect(() => getPagingData({}, 1, -1)).toThrowError();
    });
  });

  describe("getPagination", () => {
    it("Should, Given (1, 1), return {limit: 1, offset: 1} ", () => {
      expect(getPagination(1, 1)).toStrictEqual({ limit: 1, offset: 1 });
    });
    it("Should, Given (-1, 1), throw error ", () => {
      expect(() => getPagination(-1, 1)).toThrowError();
    });
    it("Should, Given (1, -1), throw error ", () => {
      expect(() => getPagination(1, -1)).toThrowError();
    });
  });
});
