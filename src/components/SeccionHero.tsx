import { Container, Row, Col } from "react-bootstrap";
import BotonColor from "./BotonColor";
import ListaLibros from "./ListaLibros";

const SeccionHero = () => {
  return (
    <section id="inicio" className="py-5 bg-light">
      <Container className="py-5">
        <Row className="align-items-center g-4">
          <Col md={6}>
            <h1 className="display-5 fw-bold">Pilar Tecno</h1>
            <p className="lead text-secondary">
              Bienvenido al curso de React. Acá vas a encontrar los cursos y
              recursos para seguir aprendiendo.
            </p>
            <BotonColor />
          </Col>
          <Col md={6}>
            <ListaLibros />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SeccionHero;
