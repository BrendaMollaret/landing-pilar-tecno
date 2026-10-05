import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import "./BarraNavegacion.css";

const BarraNavegacion = () => {
  return (
    <Navbar variant="dark" expand="lg" sticky="top" className="barra-navegacion">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-semibold d-flex align-items-center gap-3">
          <i className="bi bi-book fs-3 text-info"></i>
          Pilar Tecno
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-principal" />
        <Navbar.Collapse id="navbar-principal">
          <Nav className="ms-auto align-items-lg-center gap-lg-4">
            <Nav.Link as={NavLink} to="/" end>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/libros">
              Libros
            </Nav.Link>
            <span className="barra-avatar" aria-label="Usuario">
              BR
            </span>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BarraNavegacion;
