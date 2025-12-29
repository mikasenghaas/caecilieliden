"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";

interface ClickableImageProps {
  src: StaticImageData | string;
  alt: string;
  className?: string;
}

export default function ClickableImage({ src, alt, className = "" }: ClickableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Image in grid */}
      <div 
        className={`relative w-full break-inside-avoid mb-4 sm:mb-5 lg:mb-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-[1.02] ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          className="w-full h-auto"
        />
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80" />
          
          {/* Image container */}
          <div
            className="relative z-10 max-w-[90vw] max-h-[90vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}

