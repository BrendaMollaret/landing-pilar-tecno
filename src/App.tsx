import { Routes, Route } from "react-router-dom";
import BarraNavegacion from "./components/BarraNavegacion/BarraNavegacion";
import PaginaInicio from "./pages/PaginaInicio";
import PaginaLibros from "./pages/PaginaLibros";
import "./App.css";

function App() {
  return (
    <>
      <BarraNavegacion />
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/libros" element={<PaginaLibros />} />
      </Routes>
    </>
  );
}

export default App;
