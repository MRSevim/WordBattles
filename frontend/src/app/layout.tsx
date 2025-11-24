import { Open_Sans } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/utils/ClientWrapper";
import { Header } from "@/components/Header/Header";
import { Provider as DictionaryContext } from "@/features/language/helpers/DictionaryContext";
import { Provider as ThemeContextProvider } from "@/utils/contexts/ThemeContext";
import { Provider as CookieConsentBannerProvider } from "@/utils/contexts/CookieConsentBannerContext";
import { cookies } from "next/headers";
import { getGameCookies } from "@/features/game/utils/serverHelpers";
import { getUserData } from "@/features/auth/utils/getServerSideSession";
import Script from "next/script";
import {
  getBaseUrlFromSubdomain,
  getDictionaryFromSubdomain,
  getLocaleFromSubdomain,
} from "@/features/language/helpers/helpersServer";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { Footer } from "@/components/Footer";

const geistSans = Open_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const title = "WordBattles - Online Scrabble";

export async function generateMetadata() {
  const [dictionary, BASE_URL] = await Promise.all([
    getDictionaryFromSubdomain(),
    getBaseUrlFromSubdomain(),
  ]);

  const description = dictionary.metadata.description;

  return {
    metadataBase: new URL(BASE_URL!),
    title: {
      template: "%s | WordBattles - Online Scrabble",
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
  const initialCookieConsent = cookieStore.get("cookieConsent")?.value;
  const gtag = initialCookieConsent === "true" ? "granted" : "denied";

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
            
            gtag('consent', 'default', {
              'ad_storage': "${gtag}",
              'ad_user_data': "${gtag}",
              'ad_personalization': "${gtag}",
              'analytics_storage': "${gtag}"
            });

            gtag("config", "${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}", { page_path: window.location.pathname });`}
            </Script>
          </>
        )}
      </head>
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
            <CookieConsentBannerProvider initialConsent={initialCookieConsent}>
              <ClientWrapper
                user={user}
                gameCookies={gameCookies}
                initialLocale={initialLocale}
                dictionary={initialDictionary}
              >
                <Header />
                {children}
                <CookieConsentBanner />
                <Footer />
              </ClientWrapper>
            </CookieConsentBannerProvider>
          </ThemeContextProvider>
        </DictionaryContext>
      </body>
    </html>
  );
}
