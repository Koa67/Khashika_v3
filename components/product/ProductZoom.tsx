'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface ProductZoomProps {
  imageUrl: string;
  alt: string;
  priority?: boolean;
}

const LENS_SIZE = 150;
const ZOOM_FACTOR = 2.5;

export default function ProductZoom({ imageUrl, alt, priority = false }: ProductZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  const [isZooming, setIsZooming] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load the full-res image for canvas zoom
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      // Fallback: try without crossOrigin
      const fallbackImg = new window.Image();
      fallbackImg.src = imageUrl;
      fallbackImg.onload = () => {
        imageRef.current = fallbackImg;
        setImageLoaded(true);
      };
    };
  }, [imageUrl]);

  // Draw zoomed lens content - accounts for object-cover behavior
  const drawLens = useCallback((mouseX: number, mouseY: number) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const img = imageRef.current;
    
    if (!canvas || !container || !img || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    
    // Container dimensions
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    
    // Image natural dimensions
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    
    // Calculate object-cover scaling and offset
    const containerRatio = containerWidth / containerHeight;
    const imgRatio = imgWidth / imgHeight;
    
    let scale: number;
    let offsetX = 0;
    let offsetY = 0;
    
    if (imgRatio > containerRatio) {
      // Image wider than container - crop sides
      scale = containerHeight / imgHeight;
      offsetX = (imgWidth * scale - containerWidth) / 2;
    } else {
      // Image taller than container - crop top/bottom
      scale = containerWidth / imgWidth;
      offsetY = (imgHeight * scale - containerHeight) / 2;
    }
    
    // Mouse position relative to container
    const localX = mouseX - rect.left;
    const localY = mouseY - rect.top;
    
    // Convert to source image coordinates (accounting for object-cover offset)
    const srcCenterX = (localX + offsetX) / scale;
    const srcCenterY = (localY + offsetY) / scale;
    
    // Size of source region to sample (for 2.5x zoom)
    const sampleSize = LENS_SIZE / ZOOM_FACTOR;
    const srcX = srcCenterX - sampleSize / 2;
    const srcY = srcCenterY - sampleSize / 2;

    // Clear and draw circular clip
    ctx.clearRect(0, 0, LENS_SIZE, LENS_SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.arc(LENS_SIZE / 2, LENS_SIZE / 2, LENS_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw zoomed portion - clamp source coords to image bounds
    ctx.drawImage(
      img,
      Math.max(0, Math.min(srcX, imgWidth - sampleSize)),
      Math.max(0, Math.min(srcY, imgHeight - sampleSize)),
      sampleSize,
      sampleSize,
      0,
      0,
      LENS_SIZE,
      LENS_SIZE
    );

    ctx.restore();
  }, [imageLoaded]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Keep lens within bounds
    const clampedX = Math.max(LENS_SIZE / 2, Math.min(rect.width - LENS_SIZE / 2, x));
    const clampedY = Math.max(LENS_SIZE / 2, Math.min(rect.height - LENS_SIZE / 2, y));

    setLensPosition({ x: clampedX, y: clampedY });
    drawLens(e.clientX, e.clientY);
  }, [drawLens]);

  const handleMouseEnter = useCallback(() => {
    if (imageLoaded) {
      setIsZooming(true);
    }
  }, [imageLoaded]);

  const handleMouseLeave = useCallback(() => {
    setIsZooming(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-h-[600px] aspect-[4/5] overflow-hidden rounded-sm bg-[#f4f1eb] cursor-crosshair group"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base image */}
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover w-full h-full"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={priority}
      />

      {/* Lens overlay - Desktop only */}
      {isZooming && (
        <div
          className="absolute pointer-events-none hidden lg:block"
          style={{
            left: lensPosition.x - LENS_SIZE / 2,
            top: lensPosition.y - LENS_SIZE / 2,
            width: LENS_SIZE,
            height: LENS_SIZE,
          }}
        >
          <canvas
            ref={canvasRef}
            width={LENS_SIZE}
            height={LENS_SIZE}
            className="rounded-full border-2 border-[#2596be] shadow-lg"
            style={{
              boxShadow: '0 0 20px rgba(37, 150, 190, 0.3)',
            }}
          />
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
        <span>Zoom</span>
      </div>
    </div>
  );
}

