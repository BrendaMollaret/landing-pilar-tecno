import axios from "axios";
import type {
  FiltrosBusqueda,
  Recurso,
  RecursoFormulario,
} from "../types/Recurso";

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

export const buscarRecursos = async (
  filtros: FiltrosBusqueda,
): Promise<Recurso[]> => {
  try {
    const respuesta = await axios.get(`${BASE_URL}/negocio/busqueda`, {
      params: filtros,
    });
    return respuesta.data;
  } catch (error) {
    // La api responde 404 cuando no hay libros con esos filtros
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const prestarRecurso = async (id: string): Promise<Recurso> => {
  const respuesta = await axios.put(`${BASE_URL}/${id}/prestar`);
  return respuesta.data;
};

export const devolverRecurso = async (id: string): Promise<Recurso> => {
  const respuesta = await axios.put(`${BASE_URL}/${id}/devolver`);
  return respuesta.data;
};
