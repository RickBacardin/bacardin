"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeIn, staggerContainer } from "@/lib/animations";

const ALLOWED_MOBILE_INDICES = new Set([0, 1, 2, 3, 6]);

const Tag = ({ label, index, isHiddenOnMobile }: { label: string; index: number; isHiddenOnMobile?: boolean }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { delay: index * 0.03, duration: 0.3 },
        },
      }}
      className={`rounded-xl bg-card px-[24px] py-[16px] flex items-center text-[28px] leading-[36px] font-[500] text-muted-foreground ${
        isHiddenOnMobile ? "hidden sm:flex" : ""
      }`}
      style={{ boxShadow: "inset 0 0 18px rgba(255, 255, 255, 0.04)" }}
    >
      {label}
    </motion.div>
  );
};

export const Tags = () => {
  const t = useTranslations("tags");
  const items = t.raw("items") as string[];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="mt-[52px] lg:mt-[40px]"
    >
      <div className="mx-auto max-w-[1000px] box-content px-[12px] lg:px-0">
        {/* Заголовок секции */}
        <motion.h2
          variants={fadeIn}
          className="text-[28px] leading-[36px] font-medium text-muted-foreground mb-[32px] px-[12px] lg:px-0"
        >
          {t("title")}
        </motion.h2>

        {/* Сетка тегов */}
        <div className="flex flex-wrap gap-[14px] sm:gap-[16px]">
          {items.map((tag, index) => (
            <Tag
              key={tag}
              label={tag}
              index={index}
              isHiddenOnMobile={!ALLOWED_MOBILE_INDICES.has(index)}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

