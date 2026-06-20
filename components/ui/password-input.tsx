"use client";

import { useState } from "react";

export function PasswordInput() {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className="relative">
      <input
        name="clave"
        type={mostrar ? "text" : "password"}
        required
        placeholder="Escribe la clave"
        className="min-h-12 w-full rounded-2xl border border-neutral-300 px-4 py-3 pr-24 text-sm outline-none transition focus:border-[#6F4E37]"
      />

      <button
        type="button"
        onClick={() => setMostrar((actual) => !actual)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-neutral-100 px-3 py-2 text-xs font-bold text-neutral-700 transition hover:bg-[#6F4E37] hover:text-white"
      >
        {mostrar ? "Ocultar" : "Ver"}
      </button>
    </div>
  );
}