"use client";

import React from "react";
import StackedSurfaceFlow from "@/components/system/StackedSurfaceFlow";

export default function PortfolioFlow({ children }: { children: React.ReactNode }) {
  return (
    <StackedSurfaceFlow flowAttribute="data-portfolio-flow">
      {children}
    </StackedSurfaceFlow>
  );
}
