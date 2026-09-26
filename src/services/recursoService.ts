import axios from "axios";
import type { Recurso } from "../types/Recurso";

const BASE_URL = "http://localhost:3000/libros";

export const obtenerRecursos = async (): Promise<Recurso[]> => {
  const respuesta = await axios.get(BASE_URL);
  return respuesta.data;
};
