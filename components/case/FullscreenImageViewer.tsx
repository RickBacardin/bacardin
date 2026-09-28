"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface FullscreenImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string;
}

const buttonClassName =
  "flex items-center justify-center p-4 rounded-[32px] bg-[#202020]/65 backdrop-blur-[0.64px] shadow-[inset_0_0_18px_rgba(255,255,255,0.04)] transition-colors cursor-pointer";

export const FullscreenImageViewer = ({
  isOpen,
  onClose,
  imageUrl,
  altText = "Fullscreen view",
}: FullscreenImageViewerProps) => {
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const initialDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Сброс масштаба при каждом открытии
  useEffect(() => {
    if (isOpen) {
      setScale(1);
    }
  }, [isOpen, imageUrl]);

  // Блокировка скролла страницы и обработка Esc
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Зум колесиком мыши (только от 1x до 5x, не меньше 1x)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setScale((prevScale) => Math.min(Math.max(prevScale * zoomFactor, 1), 5));
  };

  // Pinch-to-zoom (тач-зум 2 пальцами на мобильных)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialDistanceRef.current = dist;
      initialScaleRef.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && initialDistanceRef.current !== null) {
      e.preventDefault();
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / initialDistanceRef.current;
      const newScale = Math.min(Math.max(initialScaleRef.current * ratio, 1), 5);
      setScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    initialDistanceRef.current = null;
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 top-0 right-0 bottom-0 left-0 w-screen h-screen min-h-[100dvh] z-[999] bg-black overflow-hidden select-none touch-none"
        >
          {/* Кнопка закрытия поверх всего */}
          <div className="fixed top-[28px] right-[32px] z-[1000]">
            <MagneticButton
              onClick={onClose}
              aria-label="Закрыть"
              className={buttonClassName}
            >
              <CloseIcon size={54} />
            </MagneticButton>
          </div>

          {/* Интерактивная область просмотра на весь экран */}
          <div
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          >
            <motion.div
              drag
              dragConstraints={false}
              dragElastic={0}
              style={{ scale }}
              className="relative flex items-center justify-center max-w-none max-h-none"
            >
              <img
                src={imageUrl}
                alt={altText}
                className="max-w-[100vw] max-h-[100dvh] w-auto h-auto object-contain select-none pointer-events-none"
                draggable={false}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
