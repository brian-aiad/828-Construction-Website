"use client";

import React from "react";
import StackedSurfaceFlow from "@/components/system/StackedSurfaceFlow";

export default function AduFlow({ children }: { children: React.ReactNode }) {
  return (
    <StackedSurfaceFlow
      flowAttribute="data-adu-flow"
      resizeDebounceMs={620}
    >
      {children}
    </StackedSurfaceFlow>
  );
}
