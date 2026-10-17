"use client";
import { useProductosTraducidos } from "./ProductosTraducidosProvider";

export function ProductoTraducido({ original }: { id: number; campo: "nombre" | "descripcion" | "categoria"; original: string }) {
  const { traducir } = useProductosTraducidos();
  return <>{traducir(original)}</>;
}
