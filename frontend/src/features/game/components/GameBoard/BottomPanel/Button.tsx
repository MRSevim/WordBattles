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
        "bg-brown rounded-lg flex items-center justify-center w-9 h-9 text-center text-white cursor-pointer " +
        classes
      }
    ></i>
  );
};
