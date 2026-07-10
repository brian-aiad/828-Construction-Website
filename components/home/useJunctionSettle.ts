"use client";

// Canonical implementation lives in components/system/useJunctionSettle.ts
// (shared by every stacked-surface flow — PATTERNS Fix 26). This re-export
// keeps the original home-path imports working; do not add logic here.
export { useJunctionSettle } from "@/components/system/useJunctionSettle";
