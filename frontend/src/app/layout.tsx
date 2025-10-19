import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Wrapper from "@/utils/Wrapper";
import { Header } from "@/components/Header/Header";
import { Provider as LocaleContextProvider } from "@/features/language/helpers/LocaleContext";
import { cookies } from "next/headers";
import { getLocaleFromCookie } from "@/features/language/lib/i18n";

const geistSans = Open_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WordBattles",
  description:
    "Test your vocabulary skills, Online scrabble game with English and Turkish options",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLocale = await getLocaleFromCookie(cookies);

  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        <LocaleContextProvider initialLocale={initialLocale}>
          <Wrapper>
            <Header />
            {children}
            <Analytics />
          </Wrapper>
        </LocaleContextProvider>
      </body>
    </html>
  );
}
