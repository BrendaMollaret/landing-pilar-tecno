import { useState, useEffect } from "react";
import { Card, Row, Col, Badge, Button, Modal, Alert } from "react-bootstrap";
import {
  obtenerRecursos,
  buscarRecursos,
  crearRecurso,
  actualizarRecurso,
  eliminarRecurso,
  prestarRecurso,
  devolverRecurso,
  marcarVencidos,
} from "../services/recursoService";
import type {
  FiltrosBusqueda,
  Recurso,
  RecursoFormulario,
} from "../types/Recurso";
import ModalLibro from "./ModalLibro";
import FiltrosLibros from "./FiltrosLibros";

const colorEstado = {
  Disponible: "success",
  Prestado: "warning",
  Vencido: "danger",
} as const;

const ListaLibros = () => {
  const [datos, setDatos] = useState<Recurso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [libroEditado, setLibroEditado] = useState<Recurso | null>(null);
  const [libroAEliminar, setLibroAEliminar] = useState<Recurso | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const [mensajeAccion, setMensajeAccion] = useState<string | null>(null);

  useEffect(() => {
    obtenerRecursos()
      .then(setDatos)
      .catch(() => setError("No se pudieron cargar los libros"))
      .finally(() => setCargando(false));
  }, []);

  const buscarLibros = async (filtros: FiltrosBusqueda) => {
    setCargando(true);
    setError(null);
    try {
      const hayFiltros = Object.keys(filtros).length > 0;
      setDatos(hayFiltros ? await buscarRecursos(filtros) : await obtenerRecursos());
    } catch {
      setError("No se pudieron cargar los libros");
    } finally {
      setCargando(false);
    }
  };

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

  const cambiarPrestamo = async (libro: Recurso) => {
    setErrorAccion(null);
    try {
      const actualizado =
        libro.estado === "Disponible"
          ? await prestarRecurso(libro._id)
          : await devolverRecurso(libro._id);
      setDatos((anteriores) =>
        anteriores.map((item) =>
          item._id === actualizado._id ? actualizado : item,
        ),
      );
    } catch {
      setErrorAccion("No se pudo actualizar el estado del libro");
    }
  };

  const actualizarVencidos = async () => {
    setErrorAccion(null);
    setMensajeAccion(null);
    try {
      const cantidad = await marcarVencidos();
      setMensajeAccion(`Libros marcados como vencidos: ${cantidad}`);
      setDatos(await obtenerRecursos());
    } catch {
      setErrorAccion("No se pudieron actualizar los libros vencidos");
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
        <div className="d-flex gap-2">
          <Button variant="outline-danger" onClick={actualizarVencidos}>
            Marcar vencidos
          </Button>
          <Button onClick={abrirAgregar}>Agregar libro</Button>
        </div>
      </div>

      <FiltrosLibros onBuscar={buscarLibros} />

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

      {mensajeAccion && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setMensajeAccion(null)}
        >
          {mensajeAccion}
        </Alert>
      )}

      {errorAccion && (
        <Alert variant="danger" dismissible onClose={() => setErrorAccion(null)}>
          {errorAccion}
        </Alert>
      )}

      {cargando && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      {!cargando && !error && datos.length === 0 && (
        <p className="text-secondary">No se encontraron libros</p>
      )}

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
                  <Badge bg={colorEstado[libro.estado]}>{libro.estado}</Badge>
                  {libro.fechaDevolucion && (
                    <small className="d-block text-secondary mt-2">
                      Devolver antes del{" "}
                      {new Date(libro.fechaDevolucion).toLocaleDateString(
                        "es-AR",
                      )}
                    </small>
                  )}
                  <div className="mt-3 d-flex gap-2">
                    <Button
                      size="sm"
                      variant={
                        libro.estado === "Disponible" ? "success" : "warning"
                      }
                      onClick={() => cambiarPrestamo(libro)}
                    >
                      {libro.estado === "Disponible" ? "Prestar" : "Devolver"}
                    </Button>
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
