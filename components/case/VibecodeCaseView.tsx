"use client";

import { motion } from "framer-motion";
import { RichText } from "@/components/ui/RichText";
import { VibecodeItemPreview } from "@/components/case/VibecodeItemPreview";
import type { Case } from "@/types";

interface VibecodeCaseViewProps {
  cases: Case[];
  locale: string;
  title: string;
  description: string;
  fullScreenLabel: string;
  noCasesLabel: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export const VibecodeCaseView = ({
  cases,
  locale,
  title,
  description,
  fullScreenLabel,
  noCasesLabel,
}: VibecodeCaseViewProps) => {
  return (
    <motion.div
      className="bg-background pb-24 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Шапка кейса: 1-в-1 как в GalleryCaseView */}
      <div className="box-content mx-auto px-6 pt-[300px] max-w-[956px]">
        {/* Логотип кейса слева над заголовком (120x120) */}
        <motion.div
          className="flex justify-start mb-[36px]"
          variants={itemVariants}
        >
          <img
            src="/images/icons/code.svg"
            alt="Vibecode logo"
            className="w-[120px] h-[120px] object-contain"
          />
        </motion.div>

        {/* Заголовок с количеством компонентов */}
        <motion.h1
          className="font-bold text-[42px] text-foreground md:text-[50px] leading-[46px] md:leading-[54px] tracking-tight"
          variants={itemVariants}
        >
          {title}
        </motion.h1>

        {/* Описание кейса */}
        {description && description.trim() && (
          <motion.div
            className="mt-[24px] mb-[12px]"
            variants={itemVariants}
          >
            <RichText content={description} />
          </motion.div>
        )}
      </div>

      {/* Лента компонентов (отступ между компонентами 56px) */}
      <div className="box-content mx-auto mt-[56px] px-6 max-w-[956px]">
        {cases.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground text-lg">
            {noCasesLabel}
          </p>
        ) : (
          cases.map((caseItem) => (
            <VibecodeItemPreview
              key={caseItem.id}
              caseItem={caseItem}
              locale={locale}
              fullScreenLabel={fullScreenLabel}
              variants={itemVariants}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};
