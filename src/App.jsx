import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AFDK from "./pages/AFDK";
import "./App.css";
import MultiLanguageFlowchart from "./pages/MultiLanguageFlowchart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/afdk" element={<AFDK />} />
        <Route
          path="/MultiLanguageFlowchart"
          element={<MultiLanguageFlowchart />}
        />
      </Routes>
    </Router>
  );
}

export default App;
