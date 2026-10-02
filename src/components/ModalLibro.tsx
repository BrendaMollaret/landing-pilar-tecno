import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { RecursoFormulario } from "../types/Recurso";

type Props = {
  mostrar: boolean;
  onCerrar: () => void;
  onGuardar: (datos: RecursoFormulario) => Promise<void>;
};

const esquema = Yup.object({
  titulo: Yup.string().trim().required("El título es obligatorio"),
  autor: Yup.string().trim().required("El autor es obligatorio"),
  categoria: Yup.string().trim().required("La categoría es obligatoria"),
  estado: Yup.string()
    .oneOf(["Disponible", "Prestado", "Vencido"])
    .required("El estado es obligatorio"),
});

const valoresIniciales: RecursoFormulario = {
  titulo: "",
  autor: "",
  categoria: "",
  estado: "Disponible",
};

const ModalLibro = ({ mostrar, onCerrar, onGuardar }: Props) => {
  const formik = useFormik<RecursoFormulario>({
    initialValues: valoresIniciales,
    validationSchema: esquema,
    onSubmit: async (valores, { resetForm, setStatus }) => {
      try {
        await onGuardar(valores);
        resetForm();
      } catch {
        setStatus("No se pudo guardar el libro");
      }
    },
  });

  const cerrar = () => {
    formik.resetForm();
    onCerrar();
  };

  const campoTexto = (nombre: "titulo" | "autor" | "categoria", etiqueta: string) => (
    <Form.Group className="mb-3" controlId={nombre}>
      <Form.Label>{etiqueta}</Form.Label>
      <Form.Control
        name={nombre}
        value={formik.values[nombre]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isInvalid={formik.touched[nombre] && !!formik.errors[nombre]}
      />
      <Form.Control.Feedback type="invalid">
        {formik.errors[nombre]}
      </Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <Modal show={mostrar} onHide={cerrar} centered>
      <Form onSubmit={formik.handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>Agregar libro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {campoTexto("titulo", "Título")}
          {campoTexto("autor", "Autor")}
          {campoTexto("categoria", "Categoría")}
          {formik.status && (
            <p className="text-danger mt-3 mb-0">{formik.status}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={formik.isSubmitting}>
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalLibro;
