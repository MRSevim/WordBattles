import { Header } from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { Provider } from "react-redux";
import { RootState, store } from "./lib/redux/store";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { handleDragEnd } from "./lib/helpers";
import { useAppDispatch, useAppSelector } from "./lib/redux/hooks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Rules } from "./pages/Rules";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RankedPoints } from "./pages/RankedPoints";
import { OngoingWarning } from "./components/OngoingWarning";
import { LetterSkeleton } from "./components/Letter";

function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIEND_ID}
      >
        <Provider store={store}>
          <InnerApp />
        </Provider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;

const InnerApp = () => {
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
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/oyun-hakkinda" element={<Rules />} />
        <Route path="/dereceli-puanlari" element={<RankedPoints />} />
      </Routes>

      <DragOverlay dropAnimation={null}>
        {draggingValues.activeLetter ? (
          <LetterSkeleton letter={draggingValues.activeLetter} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
