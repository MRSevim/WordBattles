import { Lang } from "@/features/language/helpers/types";
import { t } from "@/features/language/lib/i18n";

const Spinner = ({
  className = "w-12 h-12",
  variant,
  locale,
}: {
  className?: string;
  variant?: "white";
  locale: Lang;
}) => {
  if (variant === "white") {
    className = className
      ? className + " border-white/30 border-t-white"
      : className;
  }
  return (
    <div
      aria-label={t(locale, "loading")}
      className={`border-4 border-primary/30 border-t-primary rounded-full animate-spin ${className}`}
    ></div>
  );
};

export default Spinner;
