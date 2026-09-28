"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useSpring } from "framer-motion";
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
  const [rawScale, setRawScale] = useState(3);
  
  // Плавный зум через spring с мягким затуханием
  const smoothScale = useSpring(3, {
    stiffness: 220,
    damping: 28,
  });

  const initialDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(3);

  useEffect(() => {
    setMounted(true);
  }, []);

  // При открытии сразу ставим начальный зум 3x
  useEffect(() => {
    if (isOpen) {
      setRawScale(3);
      smoothScale.jump(3);
    }
  }, [isOpen, imageUrl, smoothScale]);

  useEffect(() => {
    smoothScale.set(rawScale);
  }, [rawScale, smoothScale]);

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

  // Более плавный шаг зума колесиком мыши (1.08x вместо 1.15x)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setRawScale((prevScale) => Math.min(Math.max(prevScale * zoomFactor, 1), 6));
  };

  // Плавный pinch-to-zoom на мобильных
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialDistanceRef.current = dist;
      initialScaleRef.current = rawScale;
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
      const newScale = Math.min(Math.max(initialScaleRef.current * ratio, 1), 6);
      setRawScale(newScale);
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
          transition={{ duration: 0.25 }}
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
              dragElastic={0.05}
              dragTransition={{ power: 0.15, timeConstant: 250 }}
              style={{ scale: smoothScale }}
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
