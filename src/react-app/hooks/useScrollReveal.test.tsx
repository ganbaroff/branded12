import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollReveal } from "./useScrollReveal";

describe("useScrollReveal", () => {
  it("returns isVisible true when initialVisible is true", () => {
    const { result } = renderHook(() => useScrollReveal({ initialVisible: true }));
    expect(result.current.isVisible).toBe(true);
  });

  it("returns isVisible false when initialVisible is not set", () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(result.current.isVisible).toBe(false);
  });

  it("returns a ref object", () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(result.current.ref).toBeDefined();
    expect(result.current.ref).toHaveProperty("current");
  });
});
