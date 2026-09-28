"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { LinkPreview } from "@/components/ui/LinkPreview";

interface TestimonialCardProps {
    avatar: string;
    name: string;
    role: string;
    mobileRole?: string;
    text: string;
    link?: { text: string; shortText?: string; url: string; previewImage?: string };
    index: number;
    className?: string;
}

const TestimonialCard = ({
    avatar,
    name,
    role,
    mobileRole,
    text,
    link,
    index,
    className = "",
}: TestimonialCardProps) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1, duration: 0.5 },
                },
            }}
            className={`bg-card px-[34px] lg:px-[40px] pt-[30px] pb-[31px] rounded-4xl ${className}`}
            style={{ boxShadow: "inset 0 0 18px rgba(255, 255, 255, 0.04)" }}
        >
            {/* Верхний блок с аватаром и информацией */}
            <div className="flex items-center gap-[24px] mb-[22px]">
                <Image
                    src={avatar}
                    alt={name}
                    width={51}
                    height={51}
                    className="flex-shrink-0 rounded-lg object-cover"
                    style={{ width: 51, height: 51, borderRadius: 8 }}
                />
                <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="font-medium text-[28px] text-foreground truncate leading-[26px]">
                        {name}
                    </h3>
                    <span className="mt-3 font-medium text-[28px] text-muted-foreground truncate leading-[26px]">
                        {mobileRole ? (
                            <>
                                <span className="sm:hidden">{mobileRole}</span>
                                <span className="hidden sm:inline">{role}</span>
                            </>
                        ) : (
                            role
                        )}
                    </span>
                </div>
            </div>

            {/* Текст отзыва */}
            <p className="font-[500] text-[28px] text-muted-foreground leading-[36px]">
                {text}
            </p>

            {/* Ссылка на рекомендательное письмо */}
            {link && (
                <div className="mt-[22px]">
                    <LinkPreview
                        href={link.url}
                        previewImage={link.previewImage || "/images/preview-default.png"}
                        altText={`Превью: ${link.text}`}
                        isExternal={!link.url.startsWith("/")}
                    >
                        {link.shortText ? (
                            <>
                                <span className="lg:hidden">{link.shortText}</span>
                                <span className="hidden lg:inline">{link.text}</span>
                            </>
                        ) : (
                            link.text
                        )}
                    </LinkPreview>
                </div>
            )}
        </motion.div>
    );
};

export const Testimonials = () => {
    const t = useTranslations("testimonials");

    const testimonials: Array<{
        avatar: string;
        name: string;
        role: string;
        mobileRole?: string;
        text: string;
        link?: { text: string; shortText?: string; url: string; previewImage?: string };
    }> = [
            {
                avatar: "/images/Sber.jpg",
                name: t("items.denis.name"),
                role: t("items.denis.role"),
                mobileRole: "Design Lead",
                text: t("items.denis.text"),
                link: {
                    text: t("items.denis.link"),
                    shortText: "Рекоменд. письмо",
                    url: t("items.denis.linkUrl"),
                    previewImage: "/images/letter.jpg",
                },
            },
            {
                avatar: "/images/Unitbean.jpg",
                name: t("items.anton.name"),
                role: t("items.anton.role"),
                text: t("items.anton.text"),
            },
        ];

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
                    className="mb-[32px] font-medium text-[28px] text-muted-foreground leading-[36px] px-[12px] lg:px-0"
                >
                    {t("title")}
                </motion.h2>

                {/* Сетка карточек: 1 колонка до 1024px, 2 колонки от 1024px */}
                <div className="gap-[20px] lg:gap-[24px] grid grid-cols-1 lg:grid-cols-2">
                    {testimonials.map((item, index) => (
                        <TestimonialCard
                            key={index}
                            avatar={item.avatar}
                            name={item.name}
                            role={item.role}
                            mobileRole={item.mobileRole}
                            text={item.text}
                            link={item.link}
                            index={index}
                            className={index === 1 ? "hidden sm:block" : ""}
                        />
                    ))}
                </div>
            </div>
        </motion.section>
    );
};
