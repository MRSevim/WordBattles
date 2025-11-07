export const buttonClasses =
  "bg-slate-700 focus:ring-4 font-medium rounded-lg px-5 py-2.5 cursor-pointer";

export const FindButton = ({
  onClick,
  text,
}: {
  onClick: () => void;
  text: string | React.ReactNode;
}) => {
  return (
    <button onClick={onClick} className={buttonClasses}>
      {text}
    </button>
  );
};
