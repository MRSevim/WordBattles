"use client";
import { useDictionaryContext } from "@/features/language/helpers/DictionaryContext";
import { Division } from "../utils/types/gameTypes";

interface DivisionEmojiProps {
  division?: Division;
  className?: string;
}

const emojiMap: Record<string, string> = {
  diamond: "💎",
  gold: "🥇",
  silver: "🥈",
  bronze: "🥉",
  unranked: "⚪",
  unfetched: "❔",
};

const colorMap: Record<string, string> = {
  diamond: "text-cyan-600 border-cyan-400 bg-cyan-50",
  gold: "text-yellow-600 border-yellow-400 bg-yellow-50",
  silver: "text-gray-600 border-gray-400 bg-gray-50",
  bronze: "text-amber-700 border-amber-500 bg-amber-50",
  unranked: "text-gray-700 border-gray-400 bg-gray-100",
  unfetched: "text-gray-700 border-gray-400 bg-gray-100",
};

export const DivisionComp = ({ division, className }: DivisionEmojiProps) => {
  const { dictionary } = useDictionaryContext();
  if (!division) return null;

  const emoji = emojiMap[division] ?? "❔";
  const colorClass =
    colorMap[division] ?? "text-gray-700 border-gray-400 bg-gray-100";

  return (
    <span
      title={dictionary.division[division]}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl border text-sm font-medium ${colorClass} ${
        className ?? ""
      }`}
    >
      <span className="text-base">{emoji}</span>
      <span className="capitalize">{dictionary.division[division]}</span>
    </span>
  );
};
