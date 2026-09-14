import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { CaseNavigation } from "@/components/layout/CaseNavigation";
import { VibecodeCaseView } from "@/components/case/VibecodeCaseView";
import { getVibecodeCases } from "@/lib/cases";

interface CasesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CasesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === "ru";
  const authorName = isRu ? "Эрнест фон Шульдайс" : "Ernest von Shuldays";
  const title = isRu
    ? "Вайбкодинг компоненты"
    : "Vibecoding components";
  const description = isRu
    ? "Здесь я собираю разные интересные способы завайбкодить простые элементы интересным способом"
    : "Here I collect interesting ways to vibecode simple elements in an interesting way";

  return {
    title: `${title} | ${authorName}`,
    description,
    alternates: {
      canonical: `/${locale}/cases`,
      languages: { ru: "/ru/cases", en: "/en/cases" },
    },
  };
}

export default async function CasesPage({ params }: CasesPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vibecodePage" });

  // Показываем только опубликованные вайбкод кейсы в заданном порядке
  const vibecodeCases = await getVibecodeCases();
  const titleWithCount = `${t("title")} (${vibecodeCases.length})`;

  return (
    <main className="bg-background min-h-screen">
      {/* Навигация с кнопкой назад */}
      <CaseNavigation />

      {/* Переключатель языка */}
      <div className="right-6 bottom-6 z-50 fixed">
        <LanguageSwitcher />
      </div>

      {/* Вид кейса для вайбкодинг компонентов */}
      <VibecodeCaseView
        cases={vibecodeCases}
        locale={locale}
        title={titleWithCount}
        description={t("description")}
        fullScreenLabel={t("fullScreen")}
        noCasesLabel={t("noCases")}
      />
    </main>
  );
}

