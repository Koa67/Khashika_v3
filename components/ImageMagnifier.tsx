'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  magnifierSize?: number;
  zoomLevel?: number;
}

export default function ImageMagnifier({ 
  src, 
  alt, 
  magnifierSize = 180,
  zoomLevel = 2.5
}: ImageMagnifierProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const elem = e.currentTarget;
    const { top, left, width, height } = elem.getBoundingClientRect();

    const x = e.clientX - left;
    const y = e.clientY - top;

    setXY([x, y]);
    setSize([width, height]);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-visible"
      style={{ aspectRatio: '1/1' }}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Image - object-contain pour voir toute l'image */}
      <Image
        src={src}
        alt={alt}
        fill
        priority
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Loupe */}
      {showMagnifier && (
        <div
          className="absolute pointer-events-none border-4 border-[#F0C11D] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50"
          style={{
            height: magnifierSize,
            width: magnifierSize,
            left: x - magnifierSize / 2,
            top: y - magnifierSize / 2,
            backgroundImage: `url('${src}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            backgroundPositionX: `${-x * zoomLevel + magnifierSize / 2}px`,
            backgroundPositionY: `${-y * zoomLevel + magnifierSize / 2}px`,
          }}
        />
      )}
    </div>
  );
}
