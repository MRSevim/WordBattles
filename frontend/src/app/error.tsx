"use client"; // Error boundaries must be Client Components

import Container from "@/components/Container";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale] = useLocaleContext();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="mt-20 flex flex-col items-center justify-center text-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary">
            <i className="bi bi-exclamation-circle text-2xl text-primary-foreground"></i>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">
            {t(locale, "errorBoundary.somethingWentWrong")}
          </h1>
          <p className="text-gray-500 text-sm">
            {error.message || t(locale, "errorBoundary.unexpected")}
          </p>

          <button
            onClick={() => reset()}
            className="mt-6 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow hover:opacity-90 transition"
          >
            {t(locale, "errorBoundary.tryAgain")}
          </button>
        </div>
      </div>
    </Container>
  );
}
