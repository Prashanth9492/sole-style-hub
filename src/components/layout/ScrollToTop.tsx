import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      const previousValue = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';

      return () => {
        window.history.scrollRestoration = previousValue;
      };
    }

    return;
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    let rafId = 0;

    const scrollToPageTop = () => {
      window.scrollTo(0, 0);
      root.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Force instant reset so route changes never animate from bottom to top.
    root.style.scrollBehavior = 'auto';
    scrollToPageTop();
    rafId = window.requestAnimationFrame(() => {
      scrollToPageTop();
      root.style.scrollBehavior = previousScrollBehavior;
    });

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [pathname, search]);

  return null;
};
