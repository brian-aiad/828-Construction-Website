"use client";

import React from "react";
import StackedSurfaceFlow from "@/components/system/StackedSurfaceFlow";

export default function EditorialFlow({ children }: { children: React.ReactNode }) {
  return (
    <StackedSurfaceFlow
      flowAttribute="data-editorial-flow"
      className="relative z-10 mt-[4svh]"
      surfaceClassName="relative bg-[#050505] shadow-[0_-28px_90px_-64px_rgba(0,0,0,0.9)]"
      settleSelector="[data-stack-surface], [data-snap-edge]"
      darkVeilOpacity={0.22}
    >
      {children}
    </StackedSurfaceFlow>
  );
}
