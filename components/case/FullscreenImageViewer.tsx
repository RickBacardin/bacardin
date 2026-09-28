"use client";

import { useEffect, useRef, useState, WheelEvent } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Сброс масштаба при открытии нового изображения
  useEffect(() => {
    if (isOpen) {
      setScale(1);
    }
  }, [isOpen, imageUrl]);

  // Блокировка скролла страницы при открытом модале и обработка клавиши Esc
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Зум колесиком мыши / тачпадом (Pinch / Wheel zoom)
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setScale((prevScale) => Math.min(Math.max(prevScale * zoomFactor, 0.5), 5));
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-black overflow-hidden select-none"
        >
          {/* Кнопка закрытия поверх всего в правом верхнем углу */}
          <div className="fixed top-[28px] right-[32px] z-[120]">
            <MagneticButton
              onClick={onClose}
              aria-label="Закрыть"
              className={buttonClassName}
            >
              <CloseIcon size={54} />
            </MagneticButton>
          </div>

          {/* Область просмотра на весь экран с возможностью перемещения и зума */}
          <div
            ref={containerRef}
            onWheel={handleWheel}
            className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          >
            <motion.div
              drag
              dragConstraints={false}
              dragElastic={0.1}
              style={{ scale }}
              className="relative w-full h-full flex items-center justify-center touch-none"
            >
              <img
                src={imageUrl}
                alt={altText}
                className="w-full h-full min-w-full min-h-full object-cover select-none pointer-events-none"
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
