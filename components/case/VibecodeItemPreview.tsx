"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import type { Case } from "@/types";

interface VibecodeItemPreviewProps {
  caseItem: Case;
  locale: string;
  fullScreenLabel: string;
  variants?: Variants;
}

export const VibecodeItemPreview = ({
  caseItem,
  locale,
  fullScreenLabel,
  variants,
}: VibecodeItemPreviewProps) => {
  const title =
    locale === "en" && caseItem.title_en ? caseItem.title_en : caseItem.title;

  const previewHeight = caseItem.previewHeight;

  return (
    <motion.div className="w-full mb-[56px]" variants={variants}>
      {/* Верхняя строка: Название компонента слева + "На весь экран" справа */}
      <div className="flex justify-between items-baseline mb-[32px]">
        <h2
          className="font-medium text-[28px] leading-[36px]"
          style={{ color: "#9C9C9C" }}
        >
          {title}
        </h2>

        <Link
          href={`/${locale}/cases/${caseItem.slug}`}
          className="font-medium text-[28px] leading-[36px] transition-colors cursor-pointer select-none"
          style={{ color: "#9C9C9C" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9C9C9C")}
        >
          {fullScreenLabel}
        </Link>
      </div>

      {/* Интерактивная область компонента (визуал CaseCard с главной) */}
      <article className="relative bg-[#1F1C18] p-3 rounded-[28px] w-full overflow-hidden">
        {/* Внутренний контейнер с интерактивным iframe */}
        <div
          className={`relative rounded-2xl w-full overflow-hidden ${
            !previewHeight ? "h-[420px] md:h-[600px]" : ""
          }`}
          style={{
            backgroundColor: "#16130F",
            height: previewHeight ? `${previewHeight}px` : undefined,
            maxHeight: previewHeight ? "85vh" : undefined,
          }}
        >
          {caseItem.componentUrl ? (
            <iframe
              src={caseItem.componentUrl}
              title={title}
              className="z-0 relative border-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full text-muted-foreground">
              No component URL
            </div>
          )}

          {/* Overlay для внутренней тени поверх компонента */}
          <div
            className="z-10 absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: "inset 0 0 50px rgba(255,255,255,0.03)" }}
          />
        </div>
      </article>
    </motion.div>
  );
};
