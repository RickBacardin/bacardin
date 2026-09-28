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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md overflow-hidden flex flex-col"
        >
          {/* Кнопка закрытия в стиле навбара вверху справа */}
          <div className="fixed top-[28px] right-[32px] z-[110]">
            <MagneticButton
              onClick={onClose}
              aria-label="Закрыть"
              className={buttonClassName}
            >
              <CloseIcon size={54} />
            </MagneticButton>
          </div>

          {/* Область перетаскивания и зума картинки */}
          <div
            ref={containerRef}
            className="flex-1 w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-4 md:p-8"
          >
            <motion.div
              drag
              dragConstraints={containerRef}
              dragElastic={0.15}
              className="relative max-w-none flex items-center justify-center"
            >
              <img
                src={imageUrl}
                alt={altText}
                className="max-w-[95vw] md:max-w-[90vw] max-h-[85vh] md:max-h-[90vh] object-contain rounded-2xl shadow-2xl select-none pointer-events-none"
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
