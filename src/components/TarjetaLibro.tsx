import { Button } from "react-bootstrap";
import type { Recurso } from "../types/Recurso";
import "./TarjetaLibro.css";

type Props = {
  libro: Recurso;
  onCambiarPrestamo: (libro: Recurso) => void;
  onEditar: (libro: Recurso) => void;
  onEliminar: (libro: Recurso) => void;
};

const iconoEstado = {
  Disponible: "bi-check-circle-fill",
  Prestado: "bi-book-fill",
  Vencido: "bi-exclamation-circle-fill",
} as const;

const formatearFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString("es-AR");

// Elige siempre el mismo color para la misma categoría
const colorCategoria = (categoria: string) => {
  const suma = [...categoria].reduce((total, letra) => total + letra.charCodeAt(0), 0);
  return `categoria-${suma % 4}`;
};

const TarjetaLibro = ({ libro, onCambiarPrestamo, onEditar, onEliminar }: Props) => {
  const disponible = libro.estado === "Disponible";

  return (
    <article className="tarjeta-libro h-100">
      <div className="d-flex gap-3">
        {libro.portada ? (
          <img
            src={libro.portada}
            alt={`Portada de ${libro.titulo}`}
            className="tarjeta-portada"
          />
        ) : (
          <div className="tarjeta-portada tarjeta-portada-vacia">
            <i className="bi bi-book fs-1"></i>
          </div>
        )}

        <div className="flex-grow-1 min-w-0">
          <h2 className="tarjeta-titulo">{libro.titulo}</h2>
          <p className="text-secondary mb-2">{libro.autor}</p>

          <div className="d-flex flex-wrap gap-2 mb-2">
            <span className={`chip ${colorCategoria(libro.categoria)}`}>
              {libro.categoria}
            </span>
          </div>

          <span className={`chip estado-${libro.estado.toLowerCase()}`}>
            <i className={`bi ${iconoEstado[libro.estado]} me-2`}></i>
            {libro.estado}
          </span>

          {libro.fechaPrestamo && (
            <div className="tarjeta-fechas">
              <div>
                <i className="bi bi-calendar3 me-2"></i>
                Prestado el {formatearFecha(libro.fechaPrestamo)}
              </div>
              {libro.fechaDevolucion && (
                <div>
                  <i className="bi bi-clock me-2"></i>
                  Devolver antes del {formatearFecha(libro.fechaDevolucion)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="tarjeta-acciones">
        <Button
          variant={disponible ? "success" : "warning"}
          onClick={() => onCambiarPrestamo(libro)}
        >
          <i className={`bi ${disponible ? "bi-book" : "bi-arrow-return-left"} me-2`}></i>
          {disponible ? "Prestar" : "Devolver"}
        </Button>
        <Button variant="outline-primary" onClick={() => onEditar(libro)}>
          <i className="bi bi-pencil me-2"></i>
          Editar
        </Button>
        <Button variant="outline-danger" onClick={() => onEliminar(libro)}>
          <i className="bi bi-trash me-2"></i>
          Eliminar
        </Button>
      </div>
    </article>
  );
};

export default TarjetaLibro;
