import { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import type { FiltrosBusqueda } from "../types/Recurso";

type Props = {
  onBuscar: (filtros: FiltrosBusqueda) => void;
};

const FiltrosLibros = ({ onBuscar }: Props) => {
  const [autor, setAutor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [estado, setEstado] = useState("");

  // Guardamos onBuscar en un ref para que el efecto no se dispare en cada render del padre
  const onBuscarRef = useRef(onBuscar);
  const primeraVez = useRef(true);

  useEffect(() => {
    onBuscarRef.current = onBuscar;
  }, [onBuscar]);

  useEffect(() => {
    // La lista inicial ya la carga el padre, no buscamos al montar
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }

    // Esperamos 400ms sin escribir antes de buscar (debounce)
    const temporizador = setTimeout(() => {
      const filtros: FiltrosBusqueda = {};
      if (autor.trim()) filtros.autor = autor.trim();
      if (categoria.trim()) filtros.categoria = categoria.trim();
      if (estado) filtros.estado = estado as FiltrosBusqueda["estado"];
      onBuscarRef.current(filtros);
    }, 400);

    // Si el usuario sigue escribiendo, cancelamos la búsqueda pendiente
    return () => clearTimeout(temporizador);
  }, [autor, categoria, estado]);

  const limpiar = () => {
    setAutor("");
    setCategoria("");
    setEstado("");
  };

  return (
    <Form onSubmit={(evento) => evento.preventDefault()} className="mb-4">
      <Row className="g-2">
        <Col md={4}>
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
        <Col md={2}>
          <Button variant="outline-secondary" onClick={limpiar}>
            Limpiar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FiltrosLibros;
