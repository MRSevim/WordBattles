import { Open_Sans } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/utils/ClientWrapper";
import { Header } from "@/components/Header/Header";
import { Provider as DictionaryContext } from "@/features/language/utils/DictionaryContext";
import { Provider as ThemeContextProvider } from "@/utils/contexts/ThemeContext";
import { cookies } from "next/headers";
import { getGameCookies } from "@/features/game/utils/serverHelpers";
import { getUserData } from "@/features/auth/utils/getServerSideSession";
import {
  getBaseUrlFromSubdomain,
  getDictionaryFromSubdomain,
  getLocaleFromSubdomain,
} from "@/features/language/utils/helpersServer";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Open_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const title = "WordBattles";

export async function generateMetadata() {
  const [dictionary, BASE_URL] = await Promise.all([
    getDictionaryFromSubdomain(),
    getBaseUrlFromSubdomain(),
  ]);

  const description = dictionary.metadata.description;

  return {
    metadataBase: new URL(BASE_URL!),
    title: {
      template: "%s | WordBattles",
      default: title,
    },
    alternates: {
      canonical: "/",
    },
    description,
    keywords: dictionary.metadata.keywords,
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
      <body
        className={`${
          geistSans.className
        } antialiased min-h-screen flex flex-col justify-between ${
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
              <Footer />
            </ClientWrapper>
          </ThemeContextProvider>
        </DictionaryContext>
        <Analytics />
      </body>
    </html>
  );
}
