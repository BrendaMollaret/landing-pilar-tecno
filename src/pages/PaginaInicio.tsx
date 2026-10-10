import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import BotonColor from "../components/BotonColor/BotonColor";

const PaginaInicio = () => {
  return (
    <section className="py-5 bg-light">
      <Container className="py-5">
        <Row className="align-items-center g-4">
          <Col md={6}>
            <h1 className="display-5 fw-bold">Pilar Tecno</h1>
            <p className="lead text-secondary">
              Bienvenido a la biblioteca de Pilar Tecno. Consultá el catálogo
              de libros y sumá los tuyos.
            </p>
            <div className="d-flex gap-2">
              <Link to="/libros" className="btn btn-primary">
                Ver libros
              </Link>
              <BotonColor />
            </div>
          </Col>
          <Col md={6}>
            <div
              className="rounded-4 bg-white shadow-sm d-flex align-items-center justify-content-center"
              style={{ minHeight: "220px" }}
            >
              <span className="text-secondary">
                {/* acá podés ubicar una imagen de la biblioteca */}
                Tu biblioteca, siempre a mano
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PaginaInicio;
