export type Recurso = {
  _id: string;
  titulo: string;
  autor: string;
  categoria: string;
  estado: "Disponible" | "Prestado" | "Vencido";
  fechaPrestamo?: string;
  fechaDevolucion?: string;
};
