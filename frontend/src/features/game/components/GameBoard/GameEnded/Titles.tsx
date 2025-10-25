import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";
import React from "react";

const Titles = () => {
  const [locale] = useLocaleContext();

  return (
    <div className="grid grid-rows-subgrid row-start-3 row-span-8 text-sm font-semibold text-gray-200">
      <Span>{t(locale, "game.endedModal.points")}</Span>
      <Span>{t(locale, "game.endedModal.pointsDiff")}</Span>
      <Span>{t(locale, "game.endedModal.totalWordsPlayed")}</Span>
      <Span>{t(locale, "game.endedModal.highestScoreWord")}</Span>
      <Span>{t(locale, "game.endedModal.highestScoreMove")}</Span>
      <Span>{t(locale, "game.endedModal.avgPointsPerWord")}</Span>
      <Span>{t(locale, "game.endedModal.totalPassCount")}</Span>
      <Span>{t(locale, "game.endedModal.endBonus")}</Span>
    </div>
  );
};

const Span = ({ children }: { children: React.ReactNode }) => {
  return <span className="font-semibold text-center">{children}</span>;
};

export default Titles;
