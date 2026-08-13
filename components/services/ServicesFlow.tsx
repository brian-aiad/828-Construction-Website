"use client";

import React from "react";
import StackedSurfaceFlow from "@/components/system/StackedSurfaceFlow";

export default function ServicesFlow({ children }: { children: React.ReactNode }) {
  return (
    <StackedSurfaceFlow
      flowAttribute="data-services-flow"
      className="relative z-10 bg-black"
      surfaceClassName="relative bg-black shadow-[0_-28px_90px_-64px_rgba(0,0,0,0.85)]"
    >
      {children}
    </StackedSurfaceFlow>
  );
}
