const ErrorMessage = ({ error }: { error: string }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3">
      <div className="text-red-500 text-sm font-medium">{error}</div>
    </div>
  );
};

export default ErrorMessage;
