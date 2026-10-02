import { useState, useEffect } from "react";
import { Card, Row, Col, Badge, Button, Modal } from "react-bootstrap";
import {
  obtenerRecursos,
  crearRecurso,
  actualizarRecurso,
  eliminarRecurso,
} from "../services/recursoService";
import type { Recurso, RecursoFormulario } from "../types/Recurso";
import ModalLibro from "./ModalLibro";

const ListaLibros = () => {
  const [datos, setDatos] = useState<Recurso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [libroEditado, setLibroEditado] = useState<Recurso | null>(null);
  const [libroAEliminar, setLibroAEliminar] = useState<Recurso | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  useEffect(() => {
    obtenerRecursos()
      .then(setDatos)
      .catch(() => setError("No se pudieron cargar los libros"))
      .finally(() => setCargando(false));
  }, []);

  const abrirAgregar = () => {
    setLibroEditado(null);
    setMostrarModal(true);
  };

  const abrirEditar = (libro: Recurso) => {
    setLibroEditado(libro);
    setMostrarModal(true);
  };

  const guardarLibro = async (datos: RecursoFormulario) => {
    if (libroEditado) {
      const actualizado = await actualizarRecurso(libroEditado._id, datos);
      setDatos((anteriores) =>
        anteriores.map((libro) =>
          libro._id === actualizado._id ? actualizado : libro,
        ),
      );
    } else {
      const nuevo = await crearRecurso(datos);
      setDatos((anteriores) => [...anteriores, nuevo]);
    }
    setMostrarModal(false);
  };

  const confirmarEliminar = async () => {
    if (!libroAEliminar) return;
    try {
      await eliminarRecurso(libroAEliminar._id);
      setDatos((anteriores) =>
        anteriores.filter((libro) => libro._id !== libroAEliminar._id),
      );
      cerrarEliminar();
    } catch {
      setErrorEliminar("No se pudo eliminar el libro");
    }
  };

  const cerrarEliminar = () => {
    setLibroAEliminar(null);
    setErrorEliminar(null);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Libros</h2>
        <Button onClick={abrirAgregar}>Agregar libro</Button>
      </div>

      <ModalLibro
        mostrar={mostrarModal}
        libro={libroEditado}
        onCerrar={() => setMostrarModal(false)}
        onGuardar={guardarLibro}
      />

      <Modal show={!!libroAEliminar} onHide={cerrarEliminar} centered>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar libro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que querés eliminar "{libroAEliminar?.titulo}"?
          {errorEliminar && (
            <p className="text-danger mt-3 mb-0">{errorEliminar}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarEliminar}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

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
                  <div className="mt-3 d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => abrirEditar(libro)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => setLibroAEliminar(libro)}
                    >
                      Eliminar
                    </Button>
                  </div>
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
