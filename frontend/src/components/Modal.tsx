type Props = {
  children?: React.ReactNode;
};
export const Modal = ({ children }: Props) => {
  return (
    <div className="bg-gray-400/75 z-20 absolute w-full h-full flex justify-center items-center">
      {children}
    </div>
  );
};
