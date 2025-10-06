"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { RootState, store } from "@/lib/redux/store";
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
import { Header } from "@/components/Header";
import { LetterSkeleton } from "@/features/game/components/GameBoard/LetterComp";
import { OngoingWarning } from "@/features/game/components/OngoingWarning";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
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
      <Header />
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
