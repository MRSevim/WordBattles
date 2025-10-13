type Props = {
  children?: React.ReactNode;
  z?: number;
};
export const Modal = ({ children, z }: Props) => {
  return (
    <div
      style={{ zIndex: z || 20 }}
      className={`bg-gray-400/75  absolute w-full h-full flex justify-center items-center top-0 left-0`}
    >
      {children}
    </div>
  );
};
