const Spinner = ({
  className,
  variant,
}: {
  className?: string;
  variant?: "white";
}) => {
  if (variant === "white") {
    className = className
      ? className + " border-white/30 border-t-white"
      : className;
  }
  return (
    <div
      className={`border-4 border-primary/30 border-t-primary rounded-full animate-spin ${className}`}
    ></div>
  );
};

export default Spinner;
