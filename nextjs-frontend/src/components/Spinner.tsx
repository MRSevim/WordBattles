const Spinner = ({ className }: { className: string }) => {
  return (
    <div
      className={`border-4 border-primary/30 border-t-primary rounded-full animate-spin ${className}`}
    ></div>
  );
};

export default Spinner;
