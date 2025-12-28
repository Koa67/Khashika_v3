'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductZoomProps {
  imageUrl: string;
  alt: string;
  priority?: boolean;
  allImages?: string[]; // For lightbox
  currentIndex?: number; // For lightbox navigation
  onImageClick?: () => void; // Callback when image is clicked
}

const LENS_SIZE = 150;
const ZOOM_FACTOR = 2.5;

export default function ProductZoom({ 
  imageUrl, 
  alt, 
  priority = false,
  allImages = [],
  currentIndex = 0,
  onImageClick
}: ProductZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  const [isZooming, setIsZooming] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(currentIndex);

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

  // Update lightbox index when currentIndex changes
  useEffect(() => {
    setLightboxIndex(currentIndex);
  }, [currentIndex]);

  // Draw zoomed lens content
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

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick();
    } else if (allImages.length > 0) {
      setLightboxOpen(true);
    }
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  const handleLightboxPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allImages.length > 0) {
      setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
    }
  };

  const handleLightboxNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allImages.length > 0) {
      setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleLightboxClose();
      } else if (e.key === 'ArrowLeft') {
        handleLightboxPrev(e as any);
      } else if (e.key === 'ArrowRight') {
        handleLightboxNext(e as any);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, allImages.length]);

  const lightboxImages = allImages.length > 0 ? allImages : [imageUrl];

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full max-h-[600px] aspect-[4/5] overflow-hidden rounded-sm bg-[#f4f1eb] cursor-crosshair group"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleImageClick}
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

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={handleLightboxClose}
        >
          {/* Close button */}
          <button
            onClick={handleLightboxClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Fermer"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous button */}
          {lightboxImages.length > 1 && (
            <button
              onClick={handleLightboxPrev}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
          )}

          {/* Next button */}
          {lightboxImages.length > 1 && (
            <button
              onClick={handleLightboxNext}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          )}

          {/* Image */}
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <Image
              src={lightboxImages[lightboxIndex]}
              alt={`${alt} - Image ${lightboxIndex + 1}`}
              width={1200}
              height={1200}
              className="max-w-full max-h-[90vh] object-contain"
              priority
            />
          </div>

          {/* Image counter */}
          {lightboxImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {lightboxIndex + 1} / {lightboxImages.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
