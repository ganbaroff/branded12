import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiGet, ApiError } from "./api";

describe("api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("ApiError", () => {
    it("has status and body", () => {
      const err = new ApiError(404, { error: "Not found" });
      expect(err.status).toBe(404);
      expect(err.body?.error).toBe("Not found");
      expect(err.message).toContain("Not found");
    });
  });

  describe("apiGet", () => {
    it("throws ApiError when response is not ok", async () => {
      const mockRes = {
        ok: false,
        status: 404,
        json: async () => ({ error: "Not found" }),
      };
      vi.stubGlobal("fetch", () => Promise.resolve(mockRes));

      await expect(apiGet("/api/foo")).rejects.toThrow(ApiError);
      await expect(apiGet("/api/foo")).rejects.toMatchObject({
        status: 404,
        body: { error: "Not found" },
      });
    });

    it("returns parsed JSON when response is ok", async () => {
      const data = { id: 1, name: "test" };
      const mockRes = {
        ok: true,
        status: 200,
        json: async () => data,
      };
      vi.stubGlobal("fetch", () => Promise.resolve(mockRes));

      const result = await apiGet<typeof data>("/api/foo");
      expect(result).toEqual(data);
    });
  });
});
