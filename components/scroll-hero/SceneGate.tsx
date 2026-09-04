"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function SceneGate({ children, className }: { children: (active: boolean) => ReactNode; className: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) setLoaded(true);
      },
      { rootMargin: "35% 0px", threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={rootRef} className={className}>{loaded ? children(active) : null}</div>;
}
