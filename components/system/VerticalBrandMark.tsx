"use client";

import { usePathname } from "next/navigation";
import { SITE } from "@/lib/constants";

export default function VerticalBrandMark() {
  const pathname = usePathname();
  // Removed from the home hero per client review (round 1). Other routes unchanged.
  if (pathname === "/") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden lg:block"
      style={{
        transform: "translateY(-50%) rotate(-90deg)",
        transformOrigin: "left center",
      }}
    >
      <p className="whitespace-nowrap font-labels text-[10px] uppercase tracking-[0.32em] text-white/30">
        828 Construction &middot; {SITE.address.city}, {SITE.address.state} &middot; CA
        License #{SITE.license} &middot; South Bay Native
      </p>
    </div>
  );
}
