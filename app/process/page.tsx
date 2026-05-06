import { redirect } from "next/navigation";

// /process has been merged into /portfolio — 301 redirect handled in next.config.ts
// This component handles client-side navigation fallback.
export default function ProcessPage() {
  redirect("/portfolio");
}
