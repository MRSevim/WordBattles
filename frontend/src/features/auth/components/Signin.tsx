"use client";
import Container from "@/components/Container";
import { signInWithGoogle } from "../utils/apiCallsClient";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";

const Signin = () => {
  const [locale] = useLocaleContext();
  return (
    <Container className="flex items-center justify-center py-10">
      <div className="w-full max-w-md shadow-xl rounded-2xl p-8 dark:bg-white">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          {t(locale, "signIn")}
        </h1>

        {/* Google Login */}
        <button
          onClick={async () => await signInWithGoogle()}
          type="button"
          className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
        >
          <i className="bi bi-google text-xl"></i>
          <span className="font-medium text-gray-700">
            {t(locale, "continueWithGoogle")}
          </span>
        </button>
      </div>
    </Container>
  );
};

export default Signin;
