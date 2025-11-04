import { withParsedDates } from "../src/utils";

describe("withParsedDates", () => {
  it("should parse date strings in default date fields", () => {
    const input = {
      id: 1,
      name: "Test",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-02T00:00:00.000Z",
    };

    const result = withParsedDates(input);

    expect(result.id).toBe(1);
    expect(result.name).toBe("Test");
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(result.createdAt.toISOString()).toBe("2023-01-01T00:00:00.000Z");
    expect(result.updatedAt.toISOString()).toBe("2023-01-02T00:00:00.000Z");
  });

  it("should parse date strings in custom date fields", () => {
    const input = {
      id: 1,
      name: "Test",
      createdAt: "2023-01-01T00:00:00.000Z",
      publishedAt: "2023-01-03T00:00:00.000Z",
    };

    const result = withParsedDates(input, ["publishedAt"]);

    expect(result.id).toBe(1);
    expect(result.name).toBe("Test");
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.publishedAt).toBeInstanceOf(Date);
    expect(result.createdAt.toISOString()).toBe("2023-01-01T00:00:00.000Z");
    expect(result.publishedAt.toISOString()).toBe("2023-01-03T00:00:00.000Z");
  });

  it("should handle arrays of objects", () => {
    const input = [
      {
        id: 1,
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        createdAt: "2023-01-02T00:00:00.000Z",
      },
    ];

    const result = withParsedDates(input);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[0].createdAt).toBeInstanceOf(Date);
    expect(result[0].createdAt.toISOString()).toBe("2023-01-01T00:00:00.000Z");
    expect(result[1].id).toBe(2);
    expect(result[1].createdAt).toBeInstanceOf(Date);
    expect(result[1].createdAt.toISOString()).toBe("2023-01-02T00:00:00.000Z");
  });

  it("should handle nested objects", () => {
    const input = {
      id: 1,
      user: {
        id: 100,
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      metadata: {
        lastVisit: "2023-01-05T00:00:00.000Z",
      },
    };

    const result = withParsedDates(input, ["lastVisit"]);

    expect(result.id).toBe(1);
    expect(result.user.id).toBe(100);
    expect(result.user.createdAt).toBeInstanceOf(Date);
    expect(result.user.createdAt.toISOString()).toBe("2023-01-01T00:00:00.000Z");
    expect(result.metadata.lastVisit).toBeInstanceOf(Date);
    expect(result.metadata.lastVisit.toISOString()).toBe("2023-01-05T00:00:00.000Z");
  });

  it("should handle null and undefined values", () => {
    expect(withParsedDates(null)).toBeNull();
    expect(withParsedDates(undefined)).toBeUndefined();
  });

  it("should handle primitive values", () => {
    expect(withParsedDates("string" as any)).toBe("string");
    expect(withParsedDates(123 as any)).toBe(123);
    expect(withParsedDates(true as any)).toBe(true);
  });

  it("should not modify non-date string fields", () => {
    const input = {
      id: 1,
      name: "Test",
      description: "2023-01-01T00:00:00.000Z", // Not a date field
    };

    const result = withParsedDates(input);

    expect(result.id).toBe(1);
    expect(result.name).toBe("Test");
    expect(result.description).toBe("2023-01-01T00:00:00.000Z");
    expect(typeof result.description).toBe("string");
  });
});
