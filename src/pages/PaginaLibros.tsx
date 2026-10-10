import { Container } from "react-bootstrap";
import ListaLibros from "../components/ListaLibros/ListaLibros";
import "./PaginaLibros.css";

const PaginaLibros = () => {
  return (
    <main className="pagina-libros">
      <Container className="py-5">
        <ListaLibros />
      </Container>
    </main>
  );
};

export default PaginaLibros;
