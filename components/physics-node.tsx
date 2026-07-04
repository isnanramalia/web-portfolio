"use client";

/**
 * PhysicsNode — Dynamic SSR-safe wrapper.
 * Defers loading of Matter.js to client side, optimizing page loading speeds
 * while preserving full SEO and initial layout structures on mount.
 */

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { PhysicsNodeClientProps } from "./physics-node-client";

const PhysicsNodeClient = dynamic(
  () =>
    import("./physics-node-client").then((m) => m.PhysicsNodeClient),
  { ssr: false }
);

export function PhysicsNode(props: PhysicsNodeClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render static layout wrapper during SSR and initial client hydration
    // to preserve structure, avoid CLS, and maintain SEO indexing.
    return (
      <div className={props.className} style={props.style}>
        {props.children}
      </div>
    );
  }

  return <PhysicsNodeClient {...props} />;
}
