// src/app/models/comentarios.model.ts
export interface Comentario {
  id?: number;
  nombre: string;
  email: string;
  mensaje: string;
  codBodega: string;
  idPadre?: number | null;
  replies?: Comentario[];
}
