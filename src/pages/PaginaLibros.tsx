import { Container } from "react-bootstrap";
import ListaLibros from "../components/ListaLibros";

const PaginaLibros = () => {
  return (
    <Container className="py-5">
      <ListaLibros />
    </Container>
  );
};

export default PaginaLibros;
