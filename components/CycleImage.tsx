"use client";

import { useEffect, useState } from "react";

type Props = {
  images: string[];
  alt: string;
  intervalMs?: number;
  className?: string;
  fit?: "cover" | "contain";
};

export default function CycleImage({
  images,
  alt,
  intervalMs = 3200,
  className = "",
  fit = "cover",
}: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(
      () => setI((prev) => (prev + 1) % images.length),
      intervalMs,
    );
    return () => clearInterval(t);
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <div className={`absolute inset-0 ${className}`}>
      {images.map((src, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={idx === i ? alt : ""}
          loading={idx === 0 ? "eager" : "lazy"}
          className={[
            "absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out",
            fit === "contain" ? "object-contain" : "object-cover",
          ].join(" ")}
          style={{
            opacity: idx === i ? 1 : 0,
            objectPosition: fit === "cover" ? "center top" : "center",
          }}
        />
      ))}
    </div>
  );
}
