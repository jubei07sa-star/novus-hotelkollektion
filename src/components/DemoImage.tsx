"use client";

import Image from "next/image";
import { useState } from "react";

interface DemoImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  fallback?: string;
}

export function DemoImage({
  src,
  alt,
  sizes = "(max-width: 760px) 100vw, 50vw",
  priority = false,
  className = "",
  fallback = "/images/photo-fallback.svg"
}: DemoImageProps) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      src={failed ? fallback : src}
      alt={alt}
      fill
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={`cover-image ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
