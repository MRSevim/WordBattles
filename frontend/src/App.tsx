import { Header } from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { Provider } from "react-redux";
import { store } from "./lib/redux/store";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GlobalError } from "./components/GlobalError";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <GlobalError />
          <Header />
          <Routes>
            <Route path="/" element={<Homepage />}></Route>
          </Routes>
        </DndProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
