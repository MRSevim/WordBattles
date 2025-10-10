"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { AppStore, makeStore, RootState } from "@/lib/redux/store";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Provider } from "react-redux";
import { handleDragEnd } from "../features/game/utils/helpers";
import { ToastContainer } from "react-toastify";
import { LetterSkeleton } from "@/features/game/components/GameBoard/LetterComp";
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
      <WrapperInner>{children}</WrapperInner>
    </Provider>
  );
};

function WrapperInner({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );
  const draggingValues = useAppSelector(
    (state: RootState) => state.draggingValues
  );

  return (
    <DndContext sensors={sensors} onDragEnd={(e) => handleDragEnd(e, dispatch)}>
      <ToastContainer />
      <OngoingWarning />

      {children}

      <DragOverlay dropAnimation={null}>
        {draggingValues.activeLetter ? (
          <LetterSkeleton letter={draggingValues.activeLetter} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Wrapper;
