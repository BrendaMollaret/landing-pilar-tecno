import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import type { FiltrosBusqueda } from "../types/Recurso";

type Props = {
  onBuscar: (filtros: FiltrosBusqueda) => void;
};

const FiltrosLibros = ({ onBuscar }: Props) => {
  const [autor, setAutor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [estado, setEstado] = useState("");

  const buscar = (evento: React.FormEvent) => {
    evento.preventDefault();
    // Solo mandamos los filtros que tengan valor
    const filtros: FiltrosBusqueda = {};
    if (autor.trim()) filtros.autor = autor.trim();
    if (categoria.trim()) filtros.categoria = categoria.trim();
    if (estado) filtros.estado = estado as FiltrosBusqueda["estado"];
    onBuscar(filtros);
  };

  const limpiar = () => {
    setAutor("");
    setCategoria("");
    setEstado("");
    onBuscar({});
  };

  return (
    <Form onSubmit={buscar} className="mb-4">
      <Row className="g-2">
        <Col md={3}>
          <Form.Control
            placeholder="Autor"
            value={autor}
            onChange={(evento) => setAutor(evento.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            placeholder="Categoría"
            value={categoria}
            onChange={(evento) => setCategoria(evento.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={estado}
            onChange={(evento) => setEstado(evento.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Disponible">Disponible</option>
            <option value="Prestado">Prestado</option>
            <option value="Vencido">Vencido</option>
          </Form.Select>
        </Col>
        <Col md={3} className="d-flex gap-2">
          <Button type="submit">Buscar</Button>
          <Button variant="outline-secondary" onClick={limpiar}>
            Limpiar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FiltrosLibros;
