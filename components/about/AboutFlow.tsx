"use client";

import React from "react";
import StackedSurfaceFlow from "@/components/system/StackedSurfaceFlow";

export default function AboutFlow({ children }: { children: React.ReactNode }) {
  return (
    <StackedSurfaceFlow flowAttribute="data-about-flow">
      {children}
    </StackedSurfaceFlow>
  );
}
