"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { fadeIn, slideUp } from "@/lib/animations";

export const Hero = () => {
  const t = useTranslations("hero");

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="pt-[120px] lg:pt-[200px] 2xl:pt-[286px]"
    >
      <div className="mx-auto max-w-[1000px] box-content px-[24px] lg:px-0">
        {/* Аватарка */}
        <motion.div
          variants={slideUp}
          className="mb-[44px]"
        >
          <div className="rounded-2xl w-[340px] h-[340px] min-[414px]:w-[366px] min-[414px]:h-[366px] lg:w-[340px] lg:h-[340px] overflow-hidden relative">
            <Image
              src="/images/avatar.png"
              alt={t("name")}
              width={366}
              height={366}
              priority
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Имя и статус */}
        <motion.div
          variants={slideUp}
          className="mb-[22px] lg:mb-[14px]"
        >
          <h1 className="font-bold lg:font-medium text-[47px] leading-[54px] lg:leading-[57px]">
            <span className="text-foreground">{t("name")}</span>
            <span className="hidden lg:inline">
              {" "}
              <span className="text-[#AFCE90]">{t("status")}</span>
            </span>
          </h1>
        </motion.div>

        {/* Описание */}
        <motion.div
          variants={slideUp}
        >
          <p className="font-medium text-[28px] lg:text-[47px] text-muted-foreground leading-[36px] lg:leading-[57px]">
            {t("description")}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};
