import { DictionaryType } from "@/features/language/lib/dictionaries";

const Spinner = ({
  className = "w-12 h-12",
  variant,
  dictionary,
}: {
  className?: string;
  variant?: "white";
  dictionary: DictionaryType;
}) => {
  return (
    <div
      aria-label={dictionary.loading}
      className={`border-4 border-primary/30 border-t-primary rounded-full animate-spin ${className} ${
        variant === "white" ? " border-white/30 border-t-white" : ""
      }`}
    ></div>
  );
};

export default Spinner;
