"use client";

import { useEffect, useState } from "react";

export function ImagenProductoInput() {
  const [preview, setPreview] = useState<string | null>(null);
  const [nombreArchivo, setNombreArchivo] = useState("");

  function manejarImagen(event: React.ChangeEvent<HTMLInputElement>) {
    const archivo = event.target.files?.[0];

    if (!archivo) {
      setPreview(null);
      setNombreArchivo("");
      return;
    }

    const urlTemporal = URL.createObjectURL(archivo);

    setPreview(urlTemporal);
    setNombreArchivo(archivo.name);
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-neutral-700">
        Foto del producto
      </label>

      <label
        htmlFor="imagen"
        className="flex min-h-36 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-neutral-300 bg-[#F8F5F0] px-4 py-6 text-center transition hover:border-[#6F4E37] hover:bg-[#6F4E37]/5"
      >
        {preview ? (
          <img
            src={preview}
            alt="Vista previa del producto"
            className="h-56 w-full rounded-2xl object-cover"
          />
        ) : (
          <>
            <span className="text-4xl">📷</span>

            <span className="mt-3 text-sm font-black text-neutral-800">
              Subir foto del producto
            </span>

            <span className="mt-1 text-xs leading-5 text-neutral-500">
              Selecciona una imagen desde tu celular o computadora
            </span>
          </>
        )}
      </label>

      <input
        id="imagen"
        name="imagen"
        type="file"
        accept="image/*"
        required
        onChange={manejarImagen}
        className="sr-only"
      />

      {nombreArchivo && (
        <p className="mt-2 rounded-2xl bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
          Imagen seleccionada: {nombreArchivo}
        </p>
      )}

      <p className="mt-2 text-xs leading-5 text-neutral-500">
        La foto se subirá a Cloudinary y se guardará automáticamente en el
        producto.
      </p>
    </div>
  );
}