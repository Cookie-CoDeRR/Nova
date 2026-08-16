"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NovaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  iconOnly?: boolean;
}

export function NovaLogo({
  className,
  size = "md",
  showText = true,
  href = "/",
  iconOnly = false,
}: NovaLogoProps) {
  const dimensions = {
    sm: {
      width: 28,
      height: 28,
      containerClass: "h-7 w-7",
      fullWidth: 100,
      fullHeight: 36,
      textSize: "text-sm",
    },
    md: {
      width: 36,
      height: 36,
      containerClass: "h-9 w-9",
      fullWidth: 120,
      fullHeight: 44,
      textSize: "text-base",
    },
    lg: {
      width: 48,
      height: 48,
      containerClass: "h-12 w-12",
      fullWidth: 160,
      fullHeight: 60,
      textSize: "text-xl",
    },
  };

  const currentSize = dimensions[size];

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group cursor-pointer", className)}>
      {iconOnly ? (
        <div className={cn("relative rounded-xl bg-white border border-gray-200 shadow-2xs p-1 flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden shrink-0", currentSize.containerClass)}>
          <Image
            src="/nova-logo-icon.png"
            alt="NOVA Star Emblem"
            width={currentSize.width}
            height={currentSize.height}
            className="object-contain w-full h-full mix-blend-multiply"
            priority
          />
        </div>
      ) : (
        <div className="relative flex items-center transition-transform group-hover:scale-105 shrink-0">
          <Image
            src="/nova-logo.png"
            alt="NOVA Logo"
            width={currentSize.fullWidth}
            height={currentSize.fullHeight}
            className="object-contain mix-blend-multiply h-auto"
            style={{ width: currentSize.fullWidth, maxHeight: currentSize.fullHeight }}
            priority
          />
        </div>
      )}

      {showText && iconOnly && (
        <span className={cn("font-extrabold tracking-tight text-gray-900 font-sans", currentSize.textSize)}>
          NOVA
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
