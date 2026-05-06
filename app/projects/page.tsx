import { redirect } from "next/navigation";

// /projects has been renamed to /portfolio — 301 redirect handled in next.config.ts
// This component handles client-side navigation fallback.
export default function ProjectsPage() {
  redirect("/portfolio");
}
