import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { set } from "../lib/redux/slices/globalErrorSlice";

export const GlobalError = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state: RootState) => state.globalError);
  if (error) {
    return (
      <div
        className="absolute top-1/4 left-1/2 z-50 p-5  -translate-x-1/2 text-sm text-red-800 rounded-lg bg-red-200"
        role="alert"
      >
        {error}{" "}
        <i
          onClick={() => dispatch(set(null))}
          className="bi bi-x-lg absolute right-1 top-1 cursor-pointer	"
        ></i>
      </div>
    );
  }
};
