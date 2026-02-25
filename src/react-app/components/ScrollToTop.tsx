import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

/**
 * Scrolls to top on route change (when no hash).
 * When there is a hash, leaves scroll to the page (e.g. Pricing handles #service-xxx).
 * Moves focus to main for accessibility.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (typeof window.history.scrollRestoration === "string") {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (!hash) {
        window.scrollTo(0, 0);
      }
      const main = document.getElementById("main-content");
      if (main && typeof main.focus === "function") {
        main.setAttribute("tabIndex", "-1");
        main.focus({ preventScroll: true });
      }
    }
  }, [pathname, hash]);

  return null;
}
