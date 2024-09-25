import { Header } from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import { Homepage } from "./pages/Homepage";

function App() {
  return (
    <BrowserRouter>
      <DndContext>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
        </Routes>
      </DndContext>
    </BrowserRouter>
  );
}

export default App;
