import { useState, useEffect, useRef } from "react";
import { Row, Col, Button, Modal, Alert } from "react-bootstrap";
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
import TarjetaLibro from "./TarjetaLibro";

// Devuelve las categorías sin repetir y ordenadas alfabéticamente
const unirCategorias = (actuales: string[], libros: Recurso[]) =>
  [...new Set([...actuales, ...libros.map((libro) => libro.categoria)])].sort();

const ListaLibros = () => {
  const [datos, setDatos] = useState<Recurso[]>([]);
  // Se acumulan para que el select de categorías no se achique al filtrar
  const [categorias, setCategorias] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [libroEditado, setLibroEditado] = useState<Recurso | null>(null);
  const [libroAEliminar, setLibroAEliminar] = useState<Recurso | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const ultimaBusqueda = useRef(0);
  const [mensajeAccion, setMensajeAccion] = useState<string | null>(null);

  useEffect(() => {
    obtenerRecursos()
      .then((libros) => {
        setDatos(libros);
        setCategorias((actuales) => unirCategorias(actuales, libros));
      })
      .catch(() => setError("No se pudieron cargar los libros"))
      .finally(() => setCargando(false));
  }, []);

  const buscarLibros = async (filtros: FiltrosBusqueda) => {
    // Si llegan respuestas desordenadas, solo se usa la de la última búsqueda
    const numeroBusqueda = ++ultimaBusqueda.current;
    setError(null);
    try {
      const hayFiltros = Object.keys(filtros).length > 0;
      const resultado = hayFiltros
        ? await buscarRecursos(filtros)
        : await obtenerRecursos();
      if (numeroBusqueda === ultimaBusqueda.current) setDatos(resultado);
    } catch {
      if (numeroBusqueda === ultimaBusqueda.current) {
        setError("No se pudieron cargar los libros");
      }
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
      setCategorias((actuales) => unirCategorias(actuales, [actualizado]));
      setDatos((anteriores) =>
        anteriores.map((libro) =>
          libro._id === actualizado._id ? actualizado : libro,
        ),
      );
    } else {
      const nuevo = await crearRecurso(datos);
      setDatos((anteriores) => [...anteriores, nuevo]);
      setCategorias((actuales) => unirCategorias(actuales, [nuevo]));
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
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h1 fw-bold mb-1">Mis libros</h1>
          <p className="text-secondary mb-0">
            Organizá tu biblioteca, seguí tus lecturas y descubrí nuevos libros.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-danger"
            className="bg-white"
            onClick={actualizarVencidos}
          >
            <i className="bi bi-calendar-x me-2"></i>
            Marcar vencidos
          </Button>
          <Button onClick={abrirAgregar}>
            <i className="bi bi-plus-lg me-2"></i>
            Agregar libro
          </Button>
        </div>
      </div>

      <FiltrosLibros categorias={categorias} onBuscar={buscarLibros} />

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
        <Row className="g-4">
          {datos.map((libro) => (
            <Col md={6} xl={4} key={libro._id}>
              <TarjetaLibro
                libro={libro}
                onCambiarPrestamo={cambiarPrestamo}
                onEditar={abrirEditar}
                onEliminar={setLibroAEliminar}
              />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default ListaLibros;
