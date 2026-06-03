import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock("js-cookie", () => ({
	default: {
		get: vi.fn(() => "mock-jwt-token"),
	},
}));

describe("fetchGet", () => {
	beforeEach(() => {
		vi.resetModules();
		mockFetch.mockReset();
	});

	it("should throw on non-ok response", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			statusText: "Not Found",
		});

		const { fetchGet } = await import("@/fetch/client");
		await expect(fetchGet("test/123")).rejects.toThrow(
			"Failed to fetch test/123: Not Found",
		);
	});

	it("should return json on ok response", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ id: 1, name: "Test" }),
		});

		const { fetchGet } = await import("@/fetch/client");
		const result = await fetchGet("plans/1");
		expect(result).toEqual({ id: 1, name: "Test" });
	});
});
