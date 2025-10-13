export const Button = ({
  onClick,
  classes,
  title,
}: {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  classes: string;
  title: string;
}) => {
  return (
    <i
      onMouseDown={onClick}
      title={title}
      className={
        "bg-brown rounded-lg w-7 h-7 flex items-center justify-center xs:w-9 xs:h-9 text-center leading-9 text-white cursor-pointer " +
        classes
      }
    ></i>
  );
};
