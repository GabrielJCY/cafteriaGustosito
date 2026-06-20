import Link from "next/link";
import { crearProducto, obtenerCategorias } from "../actions";
import { ImagenProductoInput } from "@/components/ui/imagen-producto-input";

export default async function NuevoProductoPage() {
  const categorias = await obtenerCategorias();

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-4 py-5 text-neutral-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/admin/productos"
                className="w-fit rounded-full bg-[#6F4E37]/10 px-4 py-2 text-sm font-bold text-[#6F4E37] transition hover:bg-[#6F4E37] hover:text-white"
              >
                ← Volver a productos
              </Link>

              <Link
                href="/admin/dashboard"
                className="w-fit rounded-full bg-neutral-100 px-4 py-2 text-sm font-bold text-neutral-700 transition hover:bg-neutral-200"
              >
                Dashboard
              </Link>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#6F4E37] sm:text-sm">
                Mini sistema
              </p>

              <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">
                Nuevo producto
              </h1>

              <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-base">
                Registra un desayuno, sándwich, bebida caliente o combo para
                mostrarlo luego en el catálogo.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          {categorias.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center">
              <p className="font-bold text-neutral-800">
                No existen categorías registradas.
              </p>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Primero debes crear categorías como Sándwiches, Bebidas
                calientes o Combos.
              </p>

              <Link
                href="/admin/categorias"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6F4E37]"
              >
                Ir a categorías
              </Link>
            </div>
          ) : (
            <form action={crearProducto} className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-neutral-700">
                  Categoría
                </label>

                <select
                  name="categoria_id"
                  required
                  className="min-h-12 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6F4E37]"
                >
                  <option value="">Seleccionar categoría</option>

                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-neutral-700">
                  Nombre del producto
                </label>

                <input
                  name="nombre"
                  type="text"
                  required
                  placeholder="Ej: Sándwich de pollo"
                  className="min-h-12 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-[#6F4E37]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-neutral-700">
                  Descripción
                </label>

                <textarea
                  name="descripcion"
                  required
                  rows={5}
                  placeholder="Ej: Pan fresco con pollo, queso y salsa especial de la casa."
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#6F4E37]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-neutral-700">
                  Precio en bolivianos
                </label>

                <input
                  name="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="Ej: 15"
                  className="min-h-12 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-[#6F4E37]"
                />
              </div>

              <ImagenProductoInput />

              <div className="grid gap-3 rounded-2xl bg-[#F8F5F0] p-4">
                <label className="flex min-h-11 items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-neutral-700">
                  <span>Producto destacado</span>
                  <input name="destacado" type="checkbox" />
                </label>

                <label className="flex min-h-11 items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-neutral-700">
                  <span>Disponible para mostrar</span>
                  <input name="disponible" type="checkbox" defaultChecked />
                </label>
              </div>

              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <Link
                  href="/admin/productos"
                  className="flex min-h-12 items-center justify-center rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-bold text-neutral-700 transition hover:border-[#6F4E37] hover:text-[#6F4E37]"
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  className="flex min-h-12 items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6F4E37]"
                >
                  Guardar producto
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}