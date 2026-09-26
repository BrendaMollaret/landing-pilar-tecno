import { useState, useEffect } from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { obtenerRecursos } from "../services/recursoService";
import type { Recurso } from "../types/Recurso";

const ListaLibros = () => {
  const [datos, setDatos] = useState<Recurso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerRecursos()
      .then(setDatos)
      .catch(() => setError("No se pudieron cargar los libros"))
      .finally(() => setCargando(false));
  }, []);

  return (
    <>
      <h2 className="mb-3">Libros</h2>

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
