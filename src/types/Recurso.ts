export type Recurso = {
  _id: string;
  titulo: string;
  autor: string;
  categoria: string;
  portada?: string;
  estado: "Disponible" | "Prestado" | "Vencido";
  fechaPrestamo?: string;
  fechaDevolucion?: string;
};

export type RecursoFormulario = Pick<
  Recurso,
  "titulo" | "autor" | "categoria" | "portada" | "estado"
>;

export type FiltrosBusqueda = {
  texto?: string;
  autor?: string;
  categoria?: string;
  estado?: Recurso["estado"];
};
