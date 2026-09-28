"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CaseCardItem } from "@/types";

interface CaseCardProps {
  card: CaseCardItem;
  variants?: Variants;
  className?: string;
}

export const CaseCard = ({
  card,
  variants,
  className,
}: CaseCardProps) => {
  const hasTitle = Boolean(card.title && card.title.trim());
  const hasDescription = Boolean(card.description && card.description.trim());

  if (!hasTitle && !hasDescription) return null;

  return (
    <motion.div
      className={cn(
        "border rounded-[24px] pt-[36px] pb-[37px] px-[34px] lg:px-[40px]",
        className
      )}
      style={{
        borderColor: "#272727",
        borderWidth: "3px",
        boxShadow: "inset 0 0 29px rgba(255, 255, 255, 0.05)",
        backgroundColor: "#16130F",
      }}
      variants={variants}
    >
      {hasTitle && (
        <p
          className="font-medium text-[28px] leading-[36px]"
          style={{ color: "#9C9C9C" }}
        >
          {card.title}
        </p>
      )}
      {hasDescription && (
        <p
          className={cn(
            "font-medium text-[28px] leading-[36px] whitespace-pre-line",
            hasTitle ? "mt-[20px]" : ""
          )}
          style={{ color: "#FFFFFF" }}
        >
          {card.description}
        </p>
      )}
    </motion.div>
  );
};
