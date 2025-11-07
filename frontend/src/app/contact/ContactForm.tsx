"use client";
import Container from "@/components/Container";
import { submitAction } from "./submitAction";
import { useState } from "react";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";

const initialState = {
  error: "",
  successMessage: "",
};

export default function ContactForm() {
  const [locale] = useLocaleContext();
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState(initialState);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setState(initialState);
    const formData = new FormData(e.currentTarget);
    const state = await submitAction(formData);
    setState(state);
    setIsPending(false);
  };

  return (
    <Container className="mt-10">
      <div className="max-w-xl mx-auto mt-10 p-6 bg-primary rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">
          {t(locale, "contactForm.label")}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-semibold mb-2">
              {t(locale, "contactForm.fields.name")}
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder={t(locale, "contactForm.placeholders.name")}
              required
              className="w-full p-3 border bg-white text-black rounded-md focus:outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-semibold mb-2">
              {t(locale, "contactForm.fields.email")}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder={t(locale, "contactForm.placeholders.email")}
              required
              className="w-full p-3 border bg-white text-black rounded-md focus:outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block font-semibold mb-2">
              {t(locale, "contactForm.fields.message")}
            </label>
            <textarea
              name="message"
              id="message"
              placeholder={t(locale, "contactForm.placeholders.message")}
              required
              rows={4}
              className="w-full p-3 border bg-white text-black rounded-md focus:outline"
            />
          </div>
          <button
            disabled={isPending}
            type="submit"
            className="w-full bg-white text-primary py-3 rounded-md transition duration-300 cursor-pointer disabled:cursor-not-allowed disabled:bg-zinc-500 disabled:text-gray-700"
          >
            {t(locale, "contactForm.send")}
          </button>
          {state.successMessage && (
            <div
              className="text-center mt-2 p-3 text-sm text-green-800 rounded-lg bg-green-50"
              role="alert"
            >
              <span className="font-small">{state.successMessage}</span>
            </div>
          )}
          {state.error && (
            <div
              className="text-center mt-2 p-3 text-sm text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              <span className="font-small">{state.error}</span>
            </div>
          )}
        </form>
      </div>
    </Container>
  );
}
