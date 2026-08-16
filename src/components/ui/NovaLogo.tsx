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
}

export function NovaLogo({ className, size = "md", showText = true, href = "/" }: NovaLogoProps) {
  const dimensions = {
    sm: { width: 32, height: 32, containerClass: "w-8 h-8", textSize: "text-xs" },
    md: { width: 40, height: 40, containerClass: "w-10 h-10", textSize: "text-sm" },
    lg: { width: 56, height: 56, containerClass: "w-14 h-14", textSize: "text-lg" },
  };

  const currentSize = dimensions[size];

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group cursor-pointer", className)}>
      <div className={cn("relative rounded-xl overflow-hidden bg-white border border-gray-200/80 shadow-2xs p-1 flex items-center justify-center transition-transform group-hover:scale-105", currentSize.containerClass)}>
        <Image
          src="/nova-logo.png"
          alt="NOVA Logo"
          width={currentSize.width}
          height={currentSize.height}
          className="object-contain w-full h-full mix-blend-multiply"
          priority
        />
      </div>

      {showText && (
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
