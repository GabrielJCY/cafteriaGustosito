"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Idioma = "es" | "en";
type ContextoIdioma = { idioma: Idioma; cambiarIdioma: (idioma: Idioma) => void };
const LanguageContext = createContext<ContextoIdioma | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [idioma, cambiarIdioma] = useState<Idioma>("es");
  useEffect(() => {
    try {
      const previo = window.localStorage.getItem("gustosito-idioma");
      if (previo === "es" || previo === "en") cambiarIdioma(previo);
    } catch { /* Puede estar bloqueado el almacenamiento. */ }
  }, []);
  useEffect(() => {
    document.documentElement.lang = idioma;
    try { window.localStorage.setItem("gustosito-idioma", idioma); } catch { /* Opcional */ }
  }, [idioma]);
  return <LanguageContext.Provider value={{ idioma, cambiarIdioma }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const contexto = useContext(LanguageContext);
  if (!contexto) throw new Error("useLanguage requiere LanguageProvider");
  return contexto;
}

export function Texto({ es, en }: { es: string; en: string }) {
  const { idioma } = useLanguage();
  return <>{idioma === "en" ? en : es}</>;
}

export function LanguageSwitcher() {
  const { idioma, cambiarIdioma } = useLanguage();
  return (
    <div role="group" aria-label="Idioma / Language" className="inline-flex shrink-0 rounded-full border border-cafe-200 bg-white/85 p-1 shadow-sm">
      {(["es", "en"] as const).map((valor) => (
        <button key={valor} type="button" onClick={() => cambiarIdioma(valor)} aria-pressed={idioma === valor}
          className={`min-h-9 min-w-11 rounded-full px-2 text-xs font-black transition-all ${idioma === valor ? "bg-negro text-white shadow-sm" : "text-cafe-800 hover:bg-cafe-100"}`}>
          {valor.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
