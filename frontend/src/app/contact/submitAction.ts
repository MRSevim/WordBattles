"use server";
import { getLocaleFromCookie, t } from "@/features/language/lib/i18n";
import { cookies } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const submitAction = async (formData: FormData) => {
  const locale = await getLocaleFromCookie(cookies);

  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: process.env.MY_EMAIL as string,
      subject: "Contact Form Submitted in WordBattles",
      text: `Name: ${name} \nEmail: ${email}\n\nMessage: ${message}`,
    });

    return { error: "", successMessage: t(locale, "contactForm.thanks") };
  } catch (error: any) {
    return { error: error.message, successMessage: "" };
  }
};
