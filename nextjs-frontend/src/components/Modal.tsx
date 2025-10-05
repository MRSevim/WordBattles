type Props = {
  children?: React.ReactNode;
  z?: number;
};
export const Modal = ({ children, z }: Props) => {
  return (
    <div
      className={`bg-gray-400/75 z-${
        z || 20
      } absolute w-full h-full flex justify-center items-center`}
    >
      {children}
    </div>
  );
};
