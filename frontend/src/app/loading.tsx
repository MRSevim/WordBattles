import Container from "@/components/Container";
import Spinner from "@/components/Spinner";
import { getLocaleFromCookie, t } from "@/features/language/lib/i18n";
import { cookies } from "next/headers";

export default async function Loading() {
  const locale = await getLocaleFromCookie(cookies);
  return (
    <Container className="mt-20 flex flex-col items-center justify-center text-center p-6">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-12 h-12" />
        <p className="text-base font-medium text-gray-700 animate-pulse">
          {t(locale, "loading")}
        </p>
      </div>
    </Container>
  );
}
