import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import ClientWrapper from "@/utils/ClientWrapper";
import { Header } from "@/components/Header/Header";
import { Provider as LocaleContextProvider } from "@/features/language/helpers/LocaleContext";
import { Provider as ThemeContextProvider } from "@/utils/contexts/ThemeContext";
import { cookies } from "next/headers";
import { getLocaleFromCookie } from "@/features/language/lib/i18n";
import { getGameCookies } from "@/features/game/utils/serverHelpers";
import { getUserData } from "@/features/auth/utils/getServerSideSession";

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
  const initialTheme = (await cookies()).get("theme")?.value;
  const gameCookies = await getGameCookies();
  const user = await getUserData();

  return (
    <html lang="en">
      <body
        className={`${geistSans.className} antialiased ${
          initialTheme === "dark" ? "dark" : ""
        }`}
      >
        <LocaleContextProvider initialLocale={initialLocale}>
          <ThemeContextProvider initialTheme={initialTheme}>
            <ClientWrapper user={user} gameCookies={gameCookies}>
              <Header />
              {children}
              <Analytics />
            </ClientWrapper>
          </ThemeContextProvider>
        </LocaleContextProvider>
      </body>
    </html>
  );
}
