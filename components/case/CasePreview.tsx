"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronsLeftRight } from "lucide-react";
import type { CasePreviewItem, PreviewImage } from "@/types";
import { FullscreenImageViewer } from "@/components/case/FullscreenImageViewer";

interface CasePreviewProps {
  item: CasePreviewItem;
  accentColor?: string;
  variants?: Variants;
  className?: string;
}

export const CasePreview = ({
  item,
  accentColor,
  variants,
  className,
}: CasePreviewProps) => {
  const images = (item.images || []).filter((img) => img.url && img.url.trim());
  const isComparison = item.variant === "comparison";

  // Для режима сравнения по умолчанию активно "После" (индекс 1)
  const [activeIndex, setActiveIndex] = useState(() =>
    isComparison && images.length > 1 ? 1 : 0
  );

  // Синхронизация при смене режима
  useEffect(() => {
    if (isComparison && images.length > 1) {
      setActiveIndex(1);
    } else {
      setActiveIndex(0);
    }
  }, [item.variant, images.length]);

  // Автопереключение для режима "slideshow" (гифка)
  useEffect(() => {
    if (item.variant !== "slideshow" || images.length <= 1) return;

    const intervalMs = (item.interval && item.interval > 0 ? item.interval : 3) * 1000;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [item.variant, item.interval, images.length]);

  if (images.length === 0) return null;

  const activeColor = accentColor || "#F99B7D";
  const activeImage = images[activeIndex] || images[0];

  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  return (
    <motion.div className={cn("w-full", className)} variants={variants}>
      {/* Верхняя строка: Заголовок слева + Табы справа */}
      <div className="flex justify-between items-baseline mt-[52px] mb-[32px] px-[12px] lg:px-0">
        {item.title ? (
          <h2
            className="font-medium text-[28px] leading-[36px]"
            style={{ color: "#9C9C9C" }}
          >
            {item.title}
          </h2>
        ) : (
          <div />
        )}

        {/* Табы переключения (если картинок больше 1 и это не автопереключение/гифка) */}
        {images.length > 1 && item.variant !== "slideshow" && (
          <div className="flex items-center gap-[24px]">
            {images.map((img, idx) => {
              const isActive = idx === activeIndex;
              const fallbackLabel = isComparison
                ? idx === 0
                  ? "До"
                  : "После"
                : `${idx + 1}`;
              const label = img.title && img.title.trim() ? img.title : fallbackLabel;

              return (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className="font-medium text-[28px] leading-[36px] transition-colors cursor-pointer select-none"
                  style={{
                    color: isActive ? activeColor : "#9C9C9C",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Область отображения картинки */}
      {isComparison && images.length >= 2 ? (
        <CaseComparisonSlider
          beforeImage={images[0]}
          afterImage={images[1]}
          activeIndex={activeIndex}
          accentColor={activeColor}
          title={item.title}
          onOpenFullscreen={(url) => setFullscreenImage(url)}
        />
      ) : item.variant === "slideshow" ? (
        /* Режим "Гифка": мгновенное переключение без фейдов и без схлопывания высоты */
        <div
          className="relative rounded-2xl w-full overflow-hidden cursor-pointer md:cursor-default"
          onClick={() => {
            if (typeof window !== "undefined" && window.innerWidth < 768) {
              setFullscreenImage(activeImage.hdUrl || activeImage.url);
            }
          }}
        >
          {images.map((img, idx) => (
            <img
              key={img.id || `${img.url}-${idx}`}
              src={img.url}
              alt={img.title || item.title || "Preview image"}
              className={cn(
                "w-full h-auto object-contain select-none",
                idx === activeIndex
                  ? "relative block"
                  : "absolute inset-0 invisible pointer-events-none"
              )}
              loading="eager"
            />
          ))}
        </div>
      ) : (
        /* Режим табов: прямое отображение активной картинки */
        <div
          className="relative rounded-2xl w-full overflow-hidden cursor-pointer md:cursor-default"
          onClick={() => {
            if (typeof window !== "undefined" && window.innerWidth < 768) {
              setFullscreenImage(activeImage.hdUrl || activeImage.url);
            }
          }}
        >
          <img
            src={activeImage.url}
            alt={activeImage.title || item.title || "Preview image"}
            className="block w-full h-auto object-contain select-none"
          />
        </div>
      )}

      {/* Полноэкранный просмотр */}
      <FullscreenImageViewer
        isOpen={Boolean(fullscreenImage)}
        onClose={() => setFullscreenImage(null)}
        imageUrl={fullscreenImage || ""}
        altText={item.title}
      />
    </motion.div>
  );
};

// Интерактивный слайдер сравнения "До" и "После"
interface CaseComparisonSliderProps {
  beforeImage: PreviewImage;
  afterImage: PreviewImage;
  activeIndex: number;
  accentColor: string;
  title?: string;
  onOpenFullscreen?: (url: string) => void;
}

function CaseComparisonSlider({
  beforeImage,
  afterImage,
  activeIndex,
  accentColor,
  title,
  onOpenFullscreen,
}: CaseComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [sliderPos, setSliderPos] = useState(50); // Процент разреза: 0..100

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 1000) / 10;
    setSliderPos(percent);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Включаем сравнение только на десктопах (>= 1024px)
    if (window.innerWidth >= 1024) {
      setIsHovering(true);
      updatePosition(e.clientX);
    }
  };

  const handleClick = () => {
    const activeImg = activeIndex === 0 ? beforeImage : afterImage;
    const currentUrl = activeImg.hdUrl || activeImg.url;
    if (onOpenFullscreen) {
      onOpenFullscreen(currentUrl);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
          setIsHovering(true);
        }
      }}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className="group relative rounded-xl w-full overflow-hidden cursor-pointer lg:cursor-ew-resize select-none"
    >
      {/* 1. Базовый слой: картинка "До" (видна слева от разреза на десктопе, либо если активен таб 0) */}
      <img
        src={beforeImage.url}
        alt={beforeImage.title || `${title || "Кейс"} - До`}
        className={cn(
          "w-full h-auto object-contain pointer-events-none select-none",
          activeIndex === 0 ? "block" : "hidden lg:block"
        )}
      />

      {/* 2. Верхний слой: картинка "После" (видна справа от разреза на десктопе, либо если активен таб 1) */}
      <div
        className={cn(
          "w-full h-full overflow-hidden transition-opacity duration-200 pointer-events-none",
          "lg:absolute lg:inset-0",
          activeIndex === 1 ? "block" : "hidden lg:block"
        )}
        style={{
          clipPath: isHovering
            ? `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`
            : undefined,
          opacity: isHovering ? 1 : activeIndex === 1 ? 1 : 0,
        }}
      >
        <img
          src={afterImage.url}
          alt={afterImage.title || `${title || "Кейс"} - После`}
          className="block w-full h-auto lg:h-full object-contain pointer-events-none select-none"
        />
      </div>

      {/* 3. Вертикальная разделительная линия и бегунок при наведении на десктопе */}
      {isHovering && (
        <div
          className="hidden lg:block top-0 bottom-0 z-20 absolute bg-white shadow-[0_0_14px_rgba(0,0,0,0.8)] w-[2px] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Бегунок по центру */}
          <div
            className="top-1/2 absolute flex justify-center items-center bg-white/95 shadow-xl backdrop-blur-md border border-black/10 rounded-full w-8 h-8 text-[#1A1A1A] active:scale-95 transition-transform -translate-x-1/2 -translate-y-1/2"
            style={{
              borderColor: accentColor,
            }}
          >
            <ChevronsLeftRight className="w-4 h-4 text-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}
