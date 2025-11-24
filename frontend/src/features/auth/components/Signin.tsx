"use client";
import Container from "@/components/Container";
import { signInWithGoogle } from "../utils/apiCallsClient";
import { useDictionaryContext } from "@/features/language/helpers/DictionaryContext";

const Signin = () => {
  const { dictionary } = useDictionaryContext();
  return (
    <Container className="flex items-start justify-center py-20">
      <div className="w-full max-w-md shadow-xl rounded-2xl p-8 dark:bg-white">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          {dictionary.signIn}
        </h1>

        {/* Google Login */}
        <button
          onClick={async () => await signInWithGoogle()}
          type="button"
          className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
        >
          <i className="bi bi-google text-xl"></i>
          <span className="font-medium text-gray-700">
            {dictionary.continueWithGoogle}
          </span>
        </button>
      </div>
    </Container>
  );
};

export default Signin;
