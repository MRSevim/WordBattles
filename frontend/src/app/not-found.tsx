import Container from "@/components/Container";
import { getLocaleFromCookie, t } from "@/features/language/lib/i18n";
import { cookies } from "next/headers";

export default async function NotFound() {
  const locale = await getLocaleFromCookie(cookies);
  return (
    <Container className="mt-20 flex flex-col items-center justify-center text-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary text-white">
            <i className="bi bi-search text-2xl"></i>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">
            {t(locale, "notFound.notFound")}
          </h1>
          <p className="text-gray-600 text-sm">
            {t(locale, "notFound.explanation")}
          </p>

          <a
            href="/"
            className="mt-6 px-6 py-2 rounded-lg bg-primary font-medium shadow hover:opacity-90 transition text-white"
          >
            {t(locale, "notFound.home")}
          </a>
        </div>
      </div>
    </Container>
  );
}
