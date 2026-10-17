"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLanguage } from "./LanguageProvider";
import { traduccionLocal } from "./productTranslations";

type Producto = { nombre: string; descripcion: string; categoria: string };
type Contexto = {
  traducir: (texto: string) => string;
  cargando: boolean;
  error: boolean;
};

const Context = createContext<Contexto>({
  traducir: (texto) => texto,
  cargando: false,
  error: false,
});

// Mantiene la misma interfaz del proveedor anterior, pero no hace peticiones HTTP.
export function ProductosTraducidosProvider({
  productos: _productos,
  children,
}: {
  productos: Producto[];
  children: ReactNode;
}) {
  const { idioma } = useLanguage();
  const value = useMemo<Contexto>(
    () => ({
      traducir: (texto) => (idioma === "en" ? traduccionLocal(texto) : texto),
      cargando: false,
      error: false,
    }),
    [idioma]
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useProductosTraducidos() {
  return useContext(Context);
}
