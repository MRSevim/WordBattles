"use client";

import { useDictionaryContext } from "@/features/language/helpers/DictionaryContext";
import { useCookieConsentBannerContext } from "@/utils/contexts/CookieConsentBannerContext";

const OpenCookieConsentPopupButton = () => {
  const [, setCookieConsentPopup] = useCookieConsentBannerContext();
  const { dictionary } = useDictionaryContext();
  return (
    <button
      className="hover:underline cursor-pointer"
      onClick={() => setCookieConsentPopup(true)}
    >
      {dictionary.privacyPolicyPage.choice.l2.click}
    </button>
  );
};

export default OpenCookieConsentPopupButton;
