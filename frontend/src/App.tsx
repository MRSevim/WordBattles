import { Header } from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { Provider } from "react-redux";
import { store } from "./lib/redux/store";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { handleDragEnd } from "./lib/helpers";
import { useAppDispatch } from "./lib/redux/hooks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Rules } from "./pages/Rules";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <InnerApp />
      </Provider>
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
  return (
    <DndContext sensors={sensors} onDragEnd={(e) => handleDragEnd(e, dispatch)}>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/oyun-kurallari" element={<Rules />} />
      </Routes>
    </DndContext>
  );
};
