"use client";
import { AppStore, makeStore } from "@/lib/redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { OngoingWarning } from "@/features/game/components/OngoingWarning";
import { useRef } from "react";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }
  return (
    <Provider store={storeRef.current}>
      <ToastContainer />
      <OngoingWarning />
      {children}
    </Provider>
  );
};

export default Wrapper;
