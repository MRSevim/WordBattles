"use client";

import { useDictionaryContext } from "@/features/language/helpers/DictionaryContext";
import { useCookieConsentBannerContext } from "@/utils/contexts/CookieConsentBannerContext";
import { setCookie } from "@/utils/helpers";

const CookieConsentBanner = () => {
  const { dictionary } = useDictionaryContext();
  const [bannerVisible, setBannerVisible] = useCookieConsentBannerContext();

  if (!bannerVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md p-4 rounded-xl shadow-xl bg-white border border-gray-500 text-gray-700 z-50">
      <p className="text-sm mb-3 leading-snug">
        {dictionary.cookieConsentBanner.message}{" "}
        <a
          href="/privacy-policy"
          className="underline text-blue-600 hover:text-blue-800"
        >
          {dictionary.privacyPolicy}
        </a>
        .
      </p>

      <div className="flex gap-3 justify-end">
        <button
          className="px-4 py-2 text-sm rounded-md border bg-red-600 cursor-pointer text-white border-gray-300 hover:bg-red-700"
          onClick={() => {
            if (window.gtag) {
              window.gtag("consent", "update", {
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied",
                analytics_storage: "denied",
              });
            }
            setCookie("cookieConsent", "false", 365);
            setBannerVisible(false);
          }}
        >
          {dictionary.cookieConsentBanner.deny}
        </button>

        <button
          className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
          onClick={() => {
            if (window.gtag) {
              window.gtag("consent", "update", {
                ad_storage: "granted",
                ad_user_data: "granted",
                ad_personalization: "granted",
                analytics_storage: "granted",
              });
            }
            setCookie("cookieConsent", "true", 365);
            setBannerVisible(false);
          }}
        >
          {dictionary.cookieConsentBanner.accept}
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
