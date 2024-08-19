export interface Bodega {
  id: number;
  codBodega: string;
  nombre: string;
  descripcion: string;
  texto?: string | null;
  imgUrl: string;
  visitas: number;
}
