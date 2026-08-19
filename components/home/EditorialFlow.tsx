"use client";

import React from "react";
import StackedSurfaceFlow from "@/components/system/StackedSurfaceFlow";

export default function EditorialFlow({ children }: { children: React.ReactNode }) {
  return (
    <StackedSurfaceFlow
      flowAttribute="data-editorial-flow"
      className="relative z-10 mt-[4svh]"
      surfaceClassName="relative bg-[#050505]"
      settleSelector="[data-stack-surface], [data-snap-edge]"
      darkVeilOpacity={0.22}
    >
      {children}
    </StackedSurfaceFlow>
  );
}
