"use client";

import React from "react";
import StackedSurfaceFlow from "@/components/system/StackedSurfaceFlow";

export default function ServicesFlow({ children }: { children: React.ReactNode }) {
  return (
    <StackedSurfaceFlow
      flowAttribute="data-services-flow"
      className="relative z-10 bg-black"
      surfaceClassName="relative bg-black"
    >
      {children}
    </StackedSurfaceFlow>
  );
}
