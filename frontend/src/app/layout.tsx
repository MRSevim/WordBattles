import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import ClientWrapper from "@/utils/ClientWrapper";
import { Header } from "@/components/Header/Header";
import { Provider as LocaleContextProvider } from "@/features/language/helpers/LocaleContext";
import { Provider as ThemeContextProvider } from "@/utils/contexts/ThemeContext";
import { cookies } from "next/headers";
import { getLocaleFromCookie, t } from "@/features/language/lib/i18n";
import { getGameCookies } from "@/features/game/utils/serverHelpers";
import { getUserData } from "@/features/auth/utils/getServerSideSession";

const geistSans = Open_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const title = "WordBattles";

export async function generateMetadata() {
  const locale = await getLocaleFromCookie(cookies);

  const description = t(locale, "metadata.description");

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
    title: {
      template: "%s | WordBattles",
      default: title,
    },
    alternates: {
      canonical: "/",
    },
    description,
    keywords: [
      t(locale, "metadata.keywords.onlineScrabble"),
      t(locale, "metadata.keywords.competitiveScrabble"),
      t(locale, "metadata.keywords.multiplayerWordGame"),
      t(locale, "metadata.keywords.englishScrabble"),
      t(locale, "metadata.keywords.turkishScrabble"),
      t(locale, "metadata.keywords.wordBattles"),
      t(locale, "metadata.keywords.rankedScrabbleOnline"),
      t(locale, "metadata.keywords.vocabularyChallenge"),
    ],
    openGraph: {
      title,
      description,
      url: "/",
      siteName: title,
      type: "website",
    },
  };
}

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
            <ClientWrapper
              user={user}
              gameCookies={gameCookies}
              initialLocale={initialLocale}
            >
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
