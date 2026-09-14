import type { Metadata } from "next";
import { Space_Grotesk, Google_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";
import { Toaster } from "@/components/ui/sonner";
import { ContactButtons } from "@/components/layout/ContactButtons";
import { routing } from "@/i18n/routing";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
});

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["cyrillic", "latin"],
});

// OG-картинка зависит от локали: /ru -> русский герой, /en -> английский
const OG_IMAGES = {
  ru: "/Preview.png",
  en: "/Preview-en.png",
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ogImage = OG_IMAGES[locale as keyof typeof OG_IMAGES] ?? OG_IMAGES.ru;

  return {
    metadataBase: new URL("https://bacardin.vercel.app"),
    title: {
      default: "Эрнест фон Шульдайс — AI Design Engineer",
      template: "%s | Bacardin",
    },
    description:
      "AI Design Engineer. С нуля пересобрал B2E-платформу для Правления Сбербанка и 300+ Agile-команд.",
    icons: {
      icon: "/icon.svg",
      apple: "/apple-icon.svg",
    },
    verification: {
      yandex: "f4eaaed6e44dd198",
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      alternateLocale: "en_US",
      siteName: "Bacardin Portfolio",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: { index: true, follow: true },
  };
}


interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Проверяем валидность локали
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  // Получаем сообщения для текущей локали
  const messages = await getMessages();

  // Выбираем шрифт в зависимости от локали
  const fontVariable = locale === "ru" ? googleSans.variable : spaceGrotesk.variable;
  const fontClass = locale === "ru" ? "font-google-sans" : "font-sans";

  return (
    <html lang={locale} className="dark">
      <body
        className={`${fontVariable} ${fontClass} antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider messages={messages}>
          <ContactButtons />
          {children}
          <Toaster />
        </NextIntlClientProvider>
        <Analytics />
        <GoogleAnalytics gaId="G-YXG782L92T" />
        <YandexMetrika />
      </body>
    </html>
  );
}

