import { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import type { FiltrosBusqueda } from "../../types/Recurso";

type Props = {
  categorias: string[];
  onBuscar: (filtros: FiltrosBusqueda) => void;
};

const FiltrosLibros = ({ categorias, onBuscar }: Props) => {
  const [texto, setTexto] = useState("");
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
      if (texto.trim()) filtros.texto = texto.trim();
      if (categoria) filtros.categoria = categoria;
      if (estado) filtros.estado = estado as FiltrosBusqueda["estado"];
      onBuscarRef.current(filtros);
    }, 400);

    // Si el usuario sigue escribiendo, cancelamos la búsqueda pendiente
    return () => clearTimeout(temporizador);
  }, [texto, categoria, estado]);

  const limpiar = () => {
    setTexto("");
    setCategoria("");
    setEstado("");
  };

  return (
    <Form onSubmit={(evento) => evento.preventDefault()} className="mb-4">
      <Row className="g-3">
        <Col lg={5}>
          <InputGroup>
            <InputGroup.Text className="bg-white text-secondary">
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por título, autor..."
              value={texto}
              onChange={(evento) => setTexto(evento.target.value)}
            />
          </InputGroup>
        </Col>
        <Col sm={6} lg={3}>
          <InputGroup>
            <InputGroup.Text className="bg-white text-secondary">
              <i className="bi bi-grid"></i>
            </InputGroup.Text>
            <Form.Select
              value={categoria}
              onChange={(evento) => setCategoria(evento.target.value)}
            >
              <option value="">Categoría</option>
              {categorias.map((nombre) => (
                <option key={nombre} value={nombre}>
                  {nombre}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col sm={6} lg={3}>
          <InputGroup>
            <InputGroup.Text className="bg-white text-secondary">
              <i className="bi bi-tag"></i>
            </InputGroup.Text>
            <Form.Select
              value={estado}
              onChange={(evento) => setEstado(evento.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="Disponible">Disponible</option>
              <option value="Prestado">Prestado</option>
              <option value="Vencido">Vencido</option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col lg={1} className="d-grid">
          <Button variant="light" className="border" onClick={limpiar}>
            <i className="bi bi-funnel me-1"></i>
            Limpiar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FiltrosLibros;
