import { describe, expect, it } from "vitest";

import { generatePaginationItems } from "../src/lib/pagination";

// Jest functions are globally available in Jest environment
describe("generatePaginationItems", () => {
  it("should handle a single page", () => {
    const result = generatePaginationItems({ currentPage: 1, totalPages: 1 });
    expect(result).toEqual([
      { type: "page", pageNumber: 1 },
    ]);
  });

  it("should handle two pages", () => {
    const result = generatePaginationItems({ currentPage: 1, totalPages: 2 });
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ type: "page", pageNumber: 1 });
    expect(result[1]).toEqual({ type: "page", pageNumber: 2 });
  });

  it("should show all pages when totalPages <= maxVisiblePages", () => {
    // Using totalPages=5 which is less than default maxVisiblePages=7
    const result = generatePaginationItems({ currentPage: 3, totalPages: 5 });
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ type: "page", pageNumber: 1 });
    expect(result[4]).toEqual({ type: "page", pageNumber: 5 });
    expect(result.every(item => item.type === "page")).toBe(true);
  });

  it("should handle being at first page with many pages", () => {
    const result = generatePaginationItems({ currentPage: 1, totalPages: 10 });

    // Check first and last entries
    expect(result[0]).toEqual({ type: "page", pageNumber: 1 });
    expect(result[result.length - 1]).toEqual({ type: "page", pageNumber: 10 });

    // Should include page 2 since we're on page 1
    expect(result.some(item => item.type === "page" && item.pageNumber === 2)).toBe(true);

    // Should have a gap before the last page
    expect(result.some(item => item.type === "gap")).toBe(true);
  });

  it("should handle being at last page with many pages", () => {
    const result = generatePaginationItems({ currentPage: 10, totalPages: 10 });

    // Check first and last entries
    expect(result[0]).toEqual({ type: "page", pageNumber: 1 });
    expect(result[result.length - 1]).toEqual({ type: "page", pageNumber: 10 });

    // Should include page 9 since we're on page 10
    expect(result.some(item => item.type === "page" && item.pageNumber === 9)).toBe(true);

    // Should have a gap after the first page
    expect(result.some(item => item.type === "gap")).toBe(true);
  });

  it("should handle being in the middle with many pages", () => {
    const result = generatePaginationItems({ currentPage: 50, totalPages: 100 });

    // Check first and last entries
    expect(result[0]).toEqual({ type: "page", pageNumber: 1 });
    expect(result[result.length - 1]).toEqual({ type: "page", pageNumber: 100 });

    // Current page should be included
    expect(result.some(item => item.type === "page" && item.pageNumber === 50)).toBe(true);

    // Should have gaps on both sides
    const gapCount = result.filter(item => item.type === "gap").length;
    expect(gapCount).toBe(2);
  });

  it("should handle edge case near the beginning", () => {
    const result = generatePaginationItems({ currentPage: 3, totalPages: 20 });

    // Check first and last entries
    expect(result[0]).toEqual({ type: "page", pageNumber: 1 });
    expect(result[result.length - 1]).toEqual({ type: "page", pageNumber: 20 });

    // Current page should be included
    expect(result.some(item => item.type === "page" && item.pageNumber === 3)).toBe(true);

    // Pages 2 should be included since we're near the beginning
    expect(result.some(item => item.type === "page" && item.pageNumber === 2)).toBe(true);

    // Should have at least one gap
    expect(result.some(item => item.type === "gap")).toBe(true);
  });

  it("should handle edge case near the end", () => {
    const result = generatePaginationItems({ currentPage: 18, totalPages: 20 });

    // Check first and last entries
    expect(result[0]).toEqual({ type: "page", pageNumber: 1 });
    expect(result[result.length - 1]).toEqual({ type: "page", pageNumber: 20 });

    // Current page should be included
    expect(result.some(item => item.type === "page" && item.pageNumber === 18)).toBe(true);

    // Page 19 should be included since we're near the end
    expect(result.some(item => item.type === "page" && item.pageNumber === 19)).toBe(true);

    // Should have at least one gap
    expect(result.some(item => item.type === "gap")).toBe(true);
  });

  it("should handle invalid inputs gracefully", () => {
    // Current page greater than total pages
    const result1 = generatePaginationItems({ currentPage: 10, totalPages: 5 });
    expect(result1[0]).toEqual({ type: "page", pageNumber: 1 });
    expect(result1[result1.length - 1]).toEqual({ type: "page", pageNumber: 5 });

    // Negative current page
    const result2 = generatePaginationItems({ currentPage: -1, totalPages: 5 });
    expect(result2[0]).toEqual({ type: "page", pageNumber: 1 });

    // Zero total pages
    const result3 = generatePaginationItems({ currentPage: 1, totalPages: 0 });
    expect(result3).toEqual([{ type: "page", pageNumber: 1 }]);
  });

  it("should allow customizing maxVisiblePages", () => {
    const result = generatePaginationItems({
      currentPage: 10,
      totalPages: 20,
      maxVisiblePages: 5,
    });

    // Should never have more items than maxVisiblePages
    expect(result.length).toBeLessThanOrEqual(5);

    // First and last pages should always be included
    expect(result[0]).toEqual({ type: "page", pageNumber: 1 });
    expect(result[result.length - 1]).toEqual({ type: "page", pageNumber: 20 });

    // Test extreme case with maxVisiblePages=3
    const smallResult = generatePaginationItems({
      currentPage: 5,
      totalPages: 10,
      maxVisiblePages: 3,
    });

    expect(smallResult.length).toBeLessThanOrEqual(3);
    expect(smallResult[0]).toEqual({ type: "page", pageNumber: 1 });
    expect(smallResult[smallResult.length - 1]).toEqual({ type: "page", pageNumber: 10 });
  });
});
