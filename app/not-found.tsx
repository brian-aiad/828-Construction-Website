import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function NotFound() {
  return (
    <section className="min-h-screen bg-black flex flex-col items-center justify-center px-4 pt-20">
      <div className="text-center">
        <div className="font-[var(--font-space-mono)] text-[10rem] font-bold text-gray-900 leading-none select-none">
          404
        </div>
        <h1 className="font-[var(--font-space-grotesk)] font-bold text-3xl text-white mt-4 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist. It may have been moved or
          the URL was mistyped.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-white text-black px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-gray-700 text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:border-white transition-colors"
          >
            Contact Us
          </Link>
        </div>
        <p className="mt-10 font-[var(--font-space-mono)] text-gray-600 text-sm">
          <a href={SITE.phoneHref} className="hover:text-white transition-colors">
            {SITE.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
