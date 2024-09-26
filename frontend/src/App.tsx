import { Header } from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { Provider } from "react-redux";
import { store } from "./lib/redux/store";
import { GlobalError } from "./components/GlobalError";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <GlobalError />
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
