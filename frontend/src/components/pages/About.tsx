import { getLocaleFromCookie, t } from "@/features/language/lib/i18n";
import Container from "../Container";
import { cookies } from "next/headers";
import { Lang } from "@/features/language/helpers/types";

export const About = async () => {
  const locale = await getLocaleFromCookie(cookies);

  return (
    <Container className="py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">
          {t(locale, "about.howToPlay")}
        </h1>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t(locale, "about.p1")}</li>
          <li>{t(locale, "about.p2")}</li>
          <li>{t(locale, "about.p3")} </li>
          <li>{t(locale, "about.p4")}</li>
          <li>{t(locale, "about.p5")}</li>
        </ul>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-4">
          {t(locale, "about.pointCalculation")}
        </h1>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t(locale, "about.p6")}</li>
          <li>{t(locale, "about.p7")}</li>
          <li>{t(locale, "about.p8")}</li>
          <li>{t(locale, "about.p9")}</li>
          <li>{t(locale, "about.p10")}</li>
          <li>{t(locale, "about.p11")}</li>
        </ul>
      </div>
      <div>
        <LetterTable locale={locale} />
      </div>
    </Container>
  );
};
const LetterTable = ({ locale }: { locale: Lang }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">
        {t(locale, "about.letterPool")}
      </h1>
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">{t(locale, "about.letter")}</th>
            <th className="py-2 px-4 border-b">{t(locale, "about.points")}</th>
            <th className="py-2 px-4 border-b">{t(locale, "about.amount")}</th>
          </tr>
        </thead>
        <tbody>
          {letters[locale].map((letter, index) => (
            <tr key={index} className="hover:bg-gray-50 hover:text-black">
              <td className="py-2 px-4 border-b text-center">
                {letter.letter || t(locale, "about.empty")}
              </td>
              <td className="py-2 px-4 border-b text-center">{letter.point}</td>
              <td className="py-2 px-4 border-b text-center">
                {letter.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const letters: Record<
  Lang,
  { letter: string; point: number; amount: number }[]
> = {
  tr: [
    { letter: "", point: 0, amount: 2 },
    { letter: "A", point: 1, amount: 12 },
    { letter: "B", point: 3, amount: 2 },
    { letter: "C", point: 4, amount: 2 },
    { letter: "Ç", point: 4, amount: 2 },
    { letter: "D", point: 3, amount: 2 },
    { letter: "E", point: 1, amount: 8 },
    { letter: "F", point: 8, amount: 1 },
    { letter: "G", point: 5, amount: 1 },
    { letter: "Ğ", point: 7, amount: 1 },
    { letter: "H", point: 5, amount: 1 },
    { letter: "I", point: 2, amount: 4 },
    { letter: "İ", point: 1, amount: 7 },
    { letter: "J", point: 10, amount: 1 },
    { letter: "K", point: 1, amount: 7 },
    { letter: "L", point: 1, amount: 7 },
    { letter: "M", point: 2, amount: 4 },
    { letter: "N", point: 1, amount: 5 },
    { letter: "O", point: 2, amount: 3 },
    { letter: "Ö", point: 6, amount: 1 },
    { letter: "P", point: 7, amount: 1 },
    { letter: "R", point: 2, amount: 6 },
    { letter: "S", point: 3, amount: 3 },
    { letter: "Ş", point: 4, amount: 2 },
    { letter: "T", point: 2, amount: 5 },
    { letter: "U", point: 2, amount: 3 },
    { letter: "Ü", point: 3, amount: 2 },
    { letter: "V", point: 7, amount: 1 },
    { letter: "Y", point: 3, amount: 2 },
    { letter: "Z", point: 4, amount: 2 },
  ],
  en: [
    { letter: "", point: 0, amount: 2 },
    { letter: "A", point: 1, amount: 9 },
    { letter: "B", point: 3, amount: 2 },
    { letter: "C", point: 3, amount: 2 },
    { letter: "D", point: 2, amount: 4 },
    { letter: "E", point: 1, amount: 12 },
    { letter: "F", point: 4, amount: 2 },
    { letter: "G", point: 2, amount: 3 },
    { letter: "H", point: 4, amount: 2 },
    { letter: "I", point: 1, amount: 9 },
    { letter: "J", point: 8, amount: 1 },
    { letter: "K", point: 5, amount: 1 },
    { letter: "L", point: 1, amount: 4 },
    { letter: "M", point: 3, amount: 2 },
    { letter: "N", point: 1, amount: 6 },
    { letter: "O", point: 1, amount: 8 },
    { letter: "P", point: 3, amount: 2 },
    { letter: "Q", point: 10, amount: 1 },
    { letter: "R", point: 1, amount: 6 },
    { letter: "S", point: 1, amount: 4 },
    { letter: "T", point: 1, amount: 6 },
    { letter: "U", point: 1, amount: 4 },
    { letter: "V", point: 4, amount: 2 },
    { letter: "W", point: 4, amount: 2 },
    { letter: "X", point: 8, amount: 1 },
    { letter: "Y", point: 4, amount: 2 },
    { letter: "Z", point: 10, amount: 1 },
  ],
};
