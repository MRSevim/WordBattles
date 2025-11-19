import { Open_Sans } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/utils/ClientWrapper";
import { Header } from "@/components/Header/Header";
import { Provider as DictionaryContext } from "@/features/language/helpers/DictionaryContext";
import { Provider as ThemeContextProvider } from "@/utils/contexts/ThemeContext";
import { cookies } from "next/headers";
import { getGameCookies } from "@/features/game/utils/serverHelpers";
import { getUserData } from "@/features/auth/utils/getServerSideSession";
import Script from "next/script";
import {
  getDictionaryFromSubdomain,
  getLocaleFromSubdomain,
} from "@/features/language/lib/helpersServer";

const geistSans = Open_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const title = "WordBattles";

export async function generateMetadata() {
  const dictionary = await getDictionaryFromSubdomain();

  const description = dictionary.metadata.description;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
    title: {
      template: "%s | WordBattles",
      default: title,
    },
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "https://en.wordbattles.net",
        "tr-TR": "https://tr.wordbattles.net",
      },
    },
    description,
    keywords: [
      dictionary.metadata.keywords.onlineScrabble,
      dictionary.metadata.keywords.competitiveScrabble,
      dictionary.metadata.keywords.multiplayerWordGame,
      dictionary.metadata.keywords.englishScrabble,
      dictionary.metadata.keywords.turkishScrabble,
      dictionary.metadata.keywords.wordBattles,
      dictionary.metadata.keywords.rankedScrabbleOnline,
      dictionary.metadata.keywords.vocabularyChallenge,
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
  const [initialDictionary, initialLocale, cookieStore, gameCookies, user] =
    await Promise.all([
      getDictionaryFromSubdomain(),
      getLocaleFromSubdomain(),
      cookies(),
      getGameCookies(),
      getUserData(),
    ]);

  const initialTheme = cookieStore.get("theme")?.value;

  return (
    <html lang={initialLocale}>
      <head>
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              async
              src={
                "https://www.googletagmanager.com/gtag/js?id=" +
                process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
              }
            />
            <Script id="google-analytics">
              {` window.dataLayer = window.dataLayer || [];
            function gtag() {
            dataLayer.push(arguments);
            }
            gtag("js", new Date());
            
            gtag("config", "${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}");`}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.className} antialiased ${
          initialTheme === "dark" ? "dark" : ""
        }`}
      >
        <DictionaryContext
          initialDictionary={initialDictionary}
          initialLocale={initialLocale}
        >
          <ThemeContextProvider initialTheme={initialTheme}>
            <ClientWrapper
              user={user}
              gameCookies={gameCookies}
              initialLocale={initialLocale}
              dictionary={initialDictionary}
            >
              <Header />
              {children}
            </ClientWrapper>
          </ThemeContextProvider>
        </DictionaryContext>
      </body>
    </html>
  );
}
