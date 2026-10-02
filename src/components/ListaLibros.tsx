import { useState, useEffect } from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import { obtenerRecursos, crearRecurso } from "../services/recursoService";
import type { Recurso, RecursoFormulario } from "../types/Recurso";
import ModalLibro from "./ModalLibro";

const ListaLibros = () => {
  const [datos, setDatos] = useState<Recurso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    obtenerRecursos()
      .then(setDatos)
      .catch(() => setError("No se pudieron cargar los libros"))
      .finally(() => setCargando(false));
  }, []);

  const agregarLibro = async (datos: RecursoFormulario) => {
    const nuevo = await crearRecurso(datos);
    setDatos((anteriores) => [...anteriores, nuevo]);
    setMostrarModal(false);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Libros</h2>
        <Button onClick={() => setMostrarModal(true)}>Agregar libro</Button>
      </div>

      <ModalLibro
        mostrar={mostrarModal}
        onCerrar={() => setMostrarModal(false)}
        onGuardar={agregarLibro}
      />

      {cargando && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      {!cargando && !error && (
        <Row>
          {datos.map((libro) => (
            <Col md={4} key={libro._id}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>{libro.titulo}</Card.Title>
                  <Card.Subtitle className="text-secondary mb-2">
                    {libro.autor} · {libro.categoria}
                  </Card.Subtitle>
                  <Badge bg="info">{libro.estado}</Badge>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default ListaLibros;
