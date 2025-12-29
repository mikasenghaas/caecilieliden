"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Check if mouse is already in viewport
    setIsVisible(true);

    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Hide on touch devices
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsVisible(false);
    }
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-[9999] transition-opacity duration-150"
      style={{
        left: position.x,
        top: position.y,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <svg
        width="21"
        height="30"
        viewBox="0 0 21 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <path
          d="M2.52136 29.2308C3.52136 29.2308 4.52136 29.2308 5.52136 29.2308C5.68803 28.5546 5.84636 27.8784 5.99636 27.2021C7.32514 21.2117 7.99997 15.2213 8.02086 9.23083L1.28396 12.1468C1.35349 12.2125 1.42313 12.2781 1.49289 12.3436C5.93011 16.5091 10.8293 20.1826 16.1905 23.3639C16.7862 23.7173 17.3876 24.0648 17.9947 24.4061C18.6791 23.677 19.3636 22.9479 20.048 22.2189C19.6691 21.6345 19.2844 21.0562 18.8941 20.484C15.3808 15.3342 11.4056 10.6766 6.96838 6.511C6.89862 6.44551 6.82875 6.38015 6.75876 6.31491L-5.72205e-06 -2.86102e-06L0.0218627 9.23083C0.0427523 15.2213 0.717585 21.2117 2.04636 27.2021C2.19636 27.8784 2.3547 28.5546 2.52136 29.2308Z"
          fill="#ED2E85"
        />
      </svg>
    </div>
  );
}
