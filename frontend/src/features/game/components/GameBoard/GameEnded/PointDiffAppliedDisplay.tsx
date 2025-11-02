import { selectGameType } from "@/features/game/lib/redux/selectors";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";
import { useAppSelector } from "@/lib/redux/hooks";
import React from "react";

const PointDiffAppliedDisplay = () => {
  const pointDiffApplied = useAppSelector(selectGameType) === "ranked";
  const [locale] = useLocaleContext();
  if (!pointDiffApplied) return null;
  return (
    <p className="mt-1">{t(locale, "game.endedModal.pointDiffApplied")}</p>
  );
};

export default PointDiffAppliedDisplay;
