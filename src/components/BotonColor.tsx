import { Modal, Button } from "react-bootstrap";
import { useState } from "react";

const BotonColor = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [color, setColor] = useState("#6f42f5");
  const [colorAplicado, setColorAplicado] = useState("#6f42f5");

  const aceptarColor = () => {
    setColorAplicado(color);
    setMostrarModal(false);
  };

  return (
    <>
      <Button
        style={{ backgroundColor: colorAplicado, borderColor: colorAplicado }}
        onClick={() => setMostrarModal(true)}
      >
        Cambiar color
      </Button>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Elegí un color</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex align-items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(evento) => setColor(evento.target.value)}
            className="form-control form-control-color"
          />
          <span className="text-secondary">{color}</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={aceptarColor}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BotonColor;
