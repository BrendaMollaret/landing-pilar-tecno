import axios from "axios";
import type { Recurso, RecursoFormulario } from "../types/Recurso";

const BASE_URL = "http://localhost:3000/libros";

export const obtenerRecursos = async (): Promise<Recurso[]> => {
  const respuesta = await axios.get(BASE_URL);
  return respuesta.data;
};

export const crearRecurso = async (
  datos: RecursoFormulario,
): Promise<Recurso> => {
  const respuesta = await axios.post(BASE_URL, datos);
  return respuesta.data;
};

export const actualizarRecurso = async (
  id: string,
  datos: RecursoFormulario,
): Promise<Recurso> => {
  const respuesta = await axios.put(`${BASE_URL}/${id}`, datos);
  return respuesta.data;
};

export const eliminarRecurso = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
