import { Header } from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { Provider } from "react-redux";
import { store } from "./lib/redux/store";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { GlobalError } from "./components/GlobalError";
import { handleDragEnd } from "./lib/helpers";
import { useAppDispatch } from "./lib/redux/hooks";

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
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={(e) => handleDragEnd(e, dispatch)}
    >
      <GlobalError />
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
      </Routes>
    </DndContext>
  );
};
