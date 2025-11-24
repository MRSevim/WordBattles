"use client";
import { createContext, Dispatch, SetStateAction, use, useState } from "react";

type CookieConsentBannerContextType = [
  boolean,
  Dispatch<SetStateAction<boolean>>
];

const CookieConsentBannerContext =
  createContext<CookieConsentBannerContextType | null>(null);

export const useCookieConsentBannerContext = () => {
  const context = use(CookieConsentBannerContext);
  if (!context)
    throw new Error(
      "CookieConsentBannerContext must be used within its provider"
    );

  return context;
};

export const Provider = ({
  initialConsent,
  children,
}: {
  initialConsent?: string;
  children: React.ReactNode;
}) => {
  const [cookieConsentBanner, setCookieConsentBanner] = useState<boolean>(
    initialConsent === undefined
  );

  return (
    <CookieConsentBannerContext
      value={[cookieConsentBanner, setCookieConsentBanner]}
    >
      {children}
    </CookieConsentBannerContext>
  );
};
