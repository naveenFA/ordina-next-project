"use client";

import { useEffect, useRef, useState } from "react";

/** Reveals an element once it scrolls into view (fires a single time). */
export function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.4) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
