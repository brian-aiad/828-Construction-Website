"use client";

import React from "react";
import StackedSurfaceFlow from "@/components/system/StackedSurfaceFlow";

export default function ContactFlow({ children }: { children: React.ReactNode }) {
  return (
    <StackedSurfaceFlow
      flowAttribute="data-contact-flow"
      resizeDebounceMs={780}
    >
      {children}
    </StackedSurfaceFlow>
  );
}
