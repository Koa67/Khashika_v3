'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [[containerWidth, containerHeight], setContainerSize] = useState([0, 0]);
  const [[naturalWidth, naturalHeight], setNaturalSize] = useState([0, 0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Calculer les dimensions réelles de l'image affichée (avec object-contain)
  const getDisplayedImageDimensions = () => {
    if (!containerWidth || !containerHeight || !naturalWidth || !naturalHeight) {
      return { width: containerWidth, height: containerHeight, offsetX: 0, offsetY: 0 };
    }

    const containerRatio = containerWidth / containerHeight;
    const imageRatio = naturalWidth / naturalHeight;

    let displayedWidth: number;
    let displayedHeight: number;
    let offsetX = 0;
    let offsetY = 0;

    if (imageRatio > containerRatio) {
      // Image plus large que le conteneur (barres en haut/bas)
      displayedWidth = containerWidth;
      displayedHeight = containerWidth / imageRatio;
      offsetY = (containerHeight - displayedHeight) / 2;
    } else {
      // Image plus haute que le conteneur (barres à gauche/droite)
      displayedHeight = containerHeight;
      displayedWidth = containerHeight * imageRatio;
      offsetX = (containerWidth - displayedWidth) / 2;
    }

    return { width: displayedWidth, height: displayedHeight, offsetX, offsetY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const elem = e.currentTarget;
    const { top, left, width, height } = elem.getBoundingClientRect();

    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    setXY([mouseX, mouseY]);
    setContainerSize([width, height]);
  };

  // Charger les dimensions naturelles de l'image
  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setNaturalSize([img.naturalWidth, img.naturalHeight]);
    };
  }, [src]);

  const { width: displayedWidth, height: displayedHeight, offsetX, offsetY } = getDisplayedImageDimensions();

  // Vérifier si la souris est sur l'image réelle (pas sur les barres)
  const isOverImage = x >= offsetX && x <= offsetX + displayedWidth &&
                      y >= offsetY && y <= offsetY + displayedHeight;

  // Calculer la position relative dans l'image affichée
  const relativeX = x - offsetX;
  const relativeY = y - offsetY;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-visible bg-[#FAF9F7]"
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

      {/* Loupe - seulement si la souris est sur l'image */}
      {showMagnifier && isOverImage && displayedWidth > 0 && (
        <div
          className="absolute pointer-events-none border-4 border-[#EAB615] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50"
          style={{
            height: magnifierSize,
            width: magnifierSize,
            left: x - magnifierSize / 2,
            top: y - magnifierSize / 2,
            backgroundImage: `url('${src}')`,
            backgroundRepeat: 'no-repeat',
            // Utiliser les dimensions affichées de l'image, pas du conteneur
            backgroundSize: `${displayedWidth * zoomLevel}px ${displayedHeight * zoomLevel}px`,
            // Position relative à l'image affichée
            backgroundPositionX: `${-relativeX * zoomLevel + magnifierSize / 2}px`,
            backgroundPositionY: `${-relativeY * zoomLevel + magnifierSize / 2}px`,
          }}
        />
      )}
    </div>
  );
}
