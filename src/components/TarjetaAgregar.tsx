import { Button } from "react-bootstrap";
import "./TarjetaAgregar.css";

type Props = {
  onAgregar: () => void;
};

const TarjetaAgregar = ({ onAgregar }: Props) => {
  return (
    <div className="tarjeta-agregar h-100">
      <span className="tarjeta-agregar-icono">
        <i className="bi bi-book fs-2"></i>
      </span>
      <h2 className="h5 fw-semibold mb-1">Agregar un nuevo libro</h2>
      <p className="text-secondary mb-3">
        Registrá un libro en tu biblioteca para empezar a organizar tus
        lecturas.
      </p>
      <Button onClick={onAgregar}>
        <i className="bi bi-plus-lg me-2"></i>
        Agregar libro
      </Button>
    </div>
  );
};

export default TarjetaAgregar;
