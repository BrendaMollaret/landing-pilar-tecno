import { Navbar, Nav, Container } from "react-bootstrap";

const BarraNavegacion = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand href="#inicio" className="fw-bold">
          Pilar Tecno
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-principal" />
        <Navbar.Collapse id="navbar-principal">
          <Nav className="ms-auto gap-lg-3">
            <Nav.Link href="#inicio">Inicio</Nav.Link>
            <Nav.Link href="#cursos">Cursos</Nav.Link>
            <Nav.Link href="#contacto">Contacto</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BarraNavegacion;
