type Props = {
  children?: React.ReactNode;
  z?: number;
  className?: string;
};
export const Modal = ({ children, className, z }: Props) => {
  return (
    <div
      style={{ zIndex: z || 20 }}
      className={`bg-gray-400/75 absolute w-full h-full flex justify-center items-center top-0 left-0 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
};
