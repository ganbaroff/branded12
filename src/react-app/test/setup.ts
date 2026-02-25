import "@testing-library/jest-dom/vitest";

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: readonly number[] = [];
  observe = () => {};
  disconnect = () => {};
  unobserve = () => {};
}
globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
