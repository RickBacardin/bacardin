"use client";

import { useEffect, useState, useRef, RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SESSION_STORAGE_KEY = "hasSeenCaseGalleryHint";

interface GalleryFirstImageHintProps {
  isEnglish?: boolean;
  containerRef: RefObject<HTMLElement | null>;
  onDismiss?: () => void;
}

export function GalleryFirstImageHint({
  isEnglish = false,
  containerRef,
  onDismiss,
}: GalleryFirstImageHintProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);
  const hasAppearedRef = useRef(false);

  // Проверяем сессионное хранилище при монтировании
  useEffect(() => {
    if (typeof window === "undefined") return;

    const alreadySeen = sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
    if (alreadySeen) return;

    // Разрешаем показ, если ранее не было показано
    setIsDismissed(false);
  }, []);

  // Отслеживаем скролл для появления и таймер/клик для закрытия
  useEffect(() => {
    if (isDismissed || typeof window === "undefined") return;

    let timer: NodeJS.Timeout | null = null;

    const handleDismiss = () => {
      setIsVisible(false);
      setIsDismissed(true);
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
      onDismiss?.();
    };

    const handleContainerClick = () => {
      if (timer) clearTimeout(timer);
      handleDismiss();
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener("click", handleContainerClick);
    }

    const checkVisibility = () => {
      const el = containerRef.current;
      if (!el || hasAppearedRef.current) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Условие появления: картинка вошла в зону видимости
      const isInViewport = rect.top < viewportHeight * 0.85 && rect.bottom > 0;

      if (isInViewport) {
        hasAppearedRef.current = true;
        setIsVisible(true);

        // Убираем слушатели скролла сразу после появления
        window.removeEventListener("scroll", checkVisibility);
        window.removeEventListener("resize", checkVisibility);

        // Автоматически закрываем спустя 5 секунд
        timer = setTimeout(() => {
          handleDismiss();
        }, 5000);
      }
    };

    checkVisibility();
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility, { passive: true });

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
      if (containerEl) {
        containerEl.removeEventListener("click", handleContainerClick);
      }
    };
  }, [containerRef, isDismissed, onDismiss]);

  if (isDismissed) {
    return null;
  }

  const text = isEnglish
    ? "Tap on the image to view details"
    : "Нажмите на изображение, чтобы рассмотреть детали";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute inset-0 z-10 md:hidden flex items-center justify-center bg-black/55 shadow-[inset_0_0_18px_rgba(255,255,255,0.04)] rounded-2xl px-6 pointer-events-none select-none"
        >
          <div className="w-full max-w-[430px] text-center font-medium text-white text-[28px] leading-[44px] drop-shadow-md">
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function markGalleryHintAsSeen() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
  }
}
