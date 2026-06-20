import Link from "next/link";
import { db } from "@/lib/db";
import { Notification } from "@/components/ui/notificacion";
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
} from "./actions";

type Categoria = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  orden: number;
  total_productos: number;
};

type CategoriasPageProps = {
  searchParams?: Promise<{
    q?: string;
    editar?: string;
    success?: string;
    error?: string;
  }>;
};

async function obtenerCategorias(busqueda: string): Promise<Categoria[]> {
  const texto = busqueda.trim();

  if (texto) {
    const result = await db.execute({
      sql: `
        SELECT
          c.id,
          c.nombre,
          c.slug,
          c.descripcion,
          c.orden,
          COUNT(p.id) AS total_productos
        FROM categorias c
        LEFT JOIN productos p ON p.categoria_id = c.id
        WHERE c.activo = 1
          AND (
            c.nombre LIKE ?
            OR c.slug LIKE ?
            OR c.descripcion LIKE ?
          )
        GROUP BY c.id
        ORDER BY c.orden ASC, c.nombre ASC
      `,
      args: [`%${texto}%`, `%${texto}%`, `%${texto}%`],
    });

    return result.rows.map((row) => ({
      id: Number(row.id),
      nombre: String(row.nombre),
      slug: String(row.slug),
      descripcion: row.descripcion ? String(row.descripcion) : null,
      orden: Number(row.orden),
      total_productos: Number(row.total_productos),
    }));
  }

  const result = await db.execute(`
    SELECT
      c.id,
      c.nombre,
      c.slug,
      c.descripcion,
      c.orden,
      COUNT(p.id) AS total_productos
    FROM categorias c
    LEFT JOIN productos p ON p.categoria_id = c.id
    WHERE c.activo = 1
    GROUP BY c.id
    ORDER BY c.orden ASC, c.nombre ASC
  `);

  return result.rows.map((row) => ({
    id: Number(row.id),
    nombre: String(row.nombre),
    slug: String(row.slug),
    descripcion: row.descripcion ? String(row.descripcion) : null,
    orden: Number(row.orden),
    total_productos: Number(row.total_productos),
  }));
}

async function obtenerCategoriaPorId(id: number): Promise<Categoria | null> {
  if (!id) return null;

  const result = await db.execute({
    sql: `
      SELECT
        c.id,
        c.nombre,
        c.slug,
        c.descripcion,
        c.orden,
        COUNT(p.id) AS total_productos
      FROM categorias c
      LEFT JOIN productos p ON p.categoria_id = c.id
      WHERE c.id = ?
        AND c.activo = 1
      GROUP BY c.id
      LIMIT 1
    `,
    args: [id],
  });

  const row = result.rows[0];

  if (!row) return null;

  return {
    id: Number(row.id),
    nombre: String(row.nombre),
    slug: String(row.slug),
    descripcion: row.descripcion ? String(row.descripcion) : null,
    orden: Number(row.orden),
    total_productos: Number(row.total_productos),
  };
}

export default async function CategoriasPage({
  searchParams,
}: CategoriasPageProps) {
  const params = await searchParams;

  const busqueda = params?.q || "";
  const editarId = Number(params?.editar || 0);
  const mensajeExito = params?.success || "";
  const mensajeError = params?.error || "";

  const categorias = await obtenerCategorias(busqueda);
  const categoriaEditando = await obtenerCategoriaPorId(editarId);

  const estaEditando = Boolean(categoriaEditando);

  return (
    <main className="min-h-screen bg-crema px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-6 rounded-2xl border border-cafe-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href="./dashboard"
                className="inline-flex items-center gap-1 rounded-full bg-cafe-600/10 px-4 py-2 text-sm font-semibold text-cafe-600 transition hover:bg-cafe-600 hover:text-white"
              >
                ← Volver
              </Link>

              <Link
                href="/admin/productos"
                className="inline-flex items-center rounded-full bg-cafe-100 px-4 py-2 text-sm font-semibold text-cafe-700 transition hover:bg-cafe-200"
              >
                Ir a productos
              </Link>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cafe-500">
                Gestión
              </p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl md:text-4xl text-negro">
                Categorías
              </h1>
              <p className="mt-2 text-sm text-cafe-600 sm:text-base">
                Administra las secciones de tu catálogo: sándwiches, bebidas calientes, combos y más.
              </p>
            </div>
          </div>
        </header>

        {mensajeExito && (
          <div className="mb-6">
            <Notification message={mensajeExito} type="success" />
          </div>
        )}

        {mensajeError && (
          <div className="mb-6">
            <Notification message={mensajeError} type="error" />
          </div>
        )}

        {/* Grid principal: formulario + listado */}
        <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          {/* Formulario */}
          <div className="rounded-2xl border border-cafe-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-xl font-black sm:text-2xl text-negro">
                {estaEditando ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <p className="mt-1 text-sm text-cafe-500">
                {estaEditando
                  ? "Modifica los datos de la categoría seleccionada."
                  : "Crea una nueva sección para organizar tus productos."}
              </p>
            </div>

            <form
              action={estaEditando ? actualizarCategoria : crearCategoria}
              className="space-y-5"
            >
              {categoriaEditando && (
                <input type="hidden" name="id" value={categoriaEditando.id} />
              )}

              <div>
                <label className="mb-1 block text-sm font-bold text-cafe-800">
                  Nombre *
                </label>
                <input
                  name="nombre"
                  type="text"
                  required
                  defaultValue={categoriaEditando?.nombre || ""}
                  placeholder="Ej: Sándwiches"
                  className="w-full rounded-xl border border-cafe-300 px-4 py-3 text-sm outline-none transition focus:border-cafe-600 focus:ring-2 focus:ring-cafe-600/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-cafe-800">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  rows={3}
                  defaultValue={categoriaEditando?.descripcion || ""}
                  placeholder="Describe brevemente esta categoría."
                  className="w-full rounded-xl border border-cafe-300 px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-cafe-600 focus:ring-2 focus:ring-cafe-600/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-cafe-800">
                  Orden
                </label>
                <input
                  name="orden"
                  type="number"
                  defaultValue={categoriaEditando?.orden || 0}
                  placeholder="Ej: 1"
                  className="w-full rounded-xl border border-cafe-300 px-4 py-3 text-sm outline-none transition focus:border-cafe-600 focus:ring-2 focus:ring-cafe-600/20"
                />
                <p className="mt-1 text-xs text-cafe-400">
                  Número que define el orden de aparición (menor primero).
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                {estaEditando ? (
                  <Link
                    href="/admin/categorias"
                    className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-cafe-300 px-4 py-2 text-sm font-bold text-cafe-700 transition hover:border-cafe-600 hover:text-cafe-600"
                  >
                    Cancelar edición
                  </Link>
                ) : (
                  <Link
                    href="/admin/dashboard"
                    className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-cafe-300 px-4 py-2 text-sm font-bold text-cafe-700 transition hover:border-cafe-600 hover:text-cafe-600"
                  >
                    Cancelar
                  </Link>
                )}

                <button
                  type="submit"
                  className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-cafe-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cafe-700 active:scale-[0.98]"
                >
                  {estaEditando ? "Guardar cambios" : "Crear categoría"}
                </button>
              </div>
            </form>
          </div>

          {/* Listado de categorías */}
          <div className="rounded-2xl border border-cafe-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black sm:text-2xl text-negro">
                  Categorías disponibles
                </h2>
                <p className="text-sm text-cafe-500">
                  {categorias.length} {categorias.length === 1 ? "categoría" : "categorías"}
                </p>
              </div>
            </div>

            {/* Buscador */}
            <form method="GET" action="/admin/categorias" className="mb-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  name="q"
                  type="search"
                  defaultValue={busqueda}
                  placeholder="Buscar categoría..."
                  className="min-h-12 flex-1 rounded-xl border border-cafe-300 px-4 py-3 text-sm outline-none transition focus:border-cafe-600 focus:ring-2 focus:ring-cafe-600/20"
                />
                <button
                  type="submit"
                  className="min-h-12 rounded-xl bg-cafe-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-cafe-700 active:scale-[0.98]"
                >
                  Buscar
                </button>
                {busqueda && (
                  <Link
                    href="/admin/categorias"
                    className="flex min-h-12 items-center justify-center rounded-xl border border-cafe-300 px-5 py-3 text-sm font-bold text-cafe-700 transition hover:border-cafe-600 hover:text-cafe-600"
                  >
                    Limpiar
                  </Link>
                )}
              </div>
            </form>

            {categorias.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-cafe-200 p-8 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-cafe-100 text-3xl">
                  📂
                </div>
                <p className="font-bold text-negro">No hay categorías disponibles.</p>
                <p className="mt-1 text-sm text-cafe-500">
                  Crea una nueva categoría usando el formulario.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {categorias.map((categoria) => (
                  <article
                    key={categoria.id}
                    className="rounded-2xl border border-cafe-200 bg-crema/50 p-4 transition hover:border-cafe-400 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-cafe-100 px-3 py-1 text-xs font-bold text-cafe-700">
                            Orden {categoria.orden}
                          </span>
                          <span className="rounded-full bg-cafe-200/60 px-3 py-1 text-xs font-bold text-cafe-600">
                            {categoria.total_productos} productos
                          </span>
                        </div>

                        <h3 className="text-lg font-bold sm:text-xl text-negro">
                          {categoria.nombre}
                        </h3>
                        <p className="text-xs text-cafe-400">/{categoria.slug}</p>

                        {categoria.descripcion && (
                          <p className="mt-2 text-sm text-cafe-700">
                            {categoria.descripcion}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-nowrap gap-2 sm:min-w-[140px]">
                        <Link
                          href={`/admin/categorias?editar=${categoria.id}`}
                          className="flex flex-1 items-center justify-center rounded-xl border border-cafe-300 px-4 py-2 text-sm font-bold text-cafe-700 transition hover:border-cafe-600 hover:text-cafe-600 active:scale-[0.98]"
                        >
                          Editar
                        </Link>

                        <form action={eliminarCategoria} className="flex-1">
                          <input type="hidden" name="id" value={categoria.id} />
                          <button
                            type="submit"
                            className="w-full rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 active:scale-[0.98]"
                          >
                            Eliminar
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}