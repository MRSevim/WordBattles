import { useDictionaryContext } from "@/features/language/helpers/DictionaryContext";
import { capitalizeFirstLetter } from "@/utils/helpers";
import React from "react";

const Titles = () => {
  const { dictionary } = useDictionaryContext();

  return (
    <div className="grid grid-rows-subgrid row-start-3 row-span-8 text-sm font-semibold text-gray-200">
      <Span>{capitalizeFirstLetter(dictionary.points)}</Span>
      <Span>{dictionary.game.endedModal.pointsDiff}</Span>
      <Span>{dictionary.game.endedModal.totalWordsPlayed}</Span>
      <Span>{dictionary.game.endedModal.highestScoreWord}</Span>
      <Span>{dictionary.game.endedModal.highestScoreMove}</Span>
      <Span>{dictionary.game.endedModal.avgPointsPerWord}</Span>
      <Span>{dictionary.game.endedModal.totalPassCount}</Span>
      <Span>{dictionary.game.endedModal.endBonus}</Span>
    </div>
  );
};

const Span = ({ children }: { children: React.ReactNode }) => {
  return <span className="font-semibold text-center">{children}</span>;
};

export default Titles;
