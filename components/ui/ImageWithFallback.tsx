"use client";

import Image from "next/image";
import { useState } from "react";
import { ReactNode } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallback: ReactNode;
  priority?: boolean;
}

/**
 * Tries to load a real image. If it fails (file missing), renders the
 * fallback node instead. This lets the site look great before photos arrive
 * and automatically upgrade once photos are dropped in.
 */
export default function ImageWithFallback({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  fallback,
  priority = false,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <>{fallback}</>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setHasError(true)}
    />
  );
}
