import Link from "next/link";
import { db } from "@/lib/db";
import { eliminarProducto } from "./actions";
import { Coffee, Plus, Filter } from "lucide-react";

// Tipos
type Categoria = {
  id: number;
  nombre: string;
  slug: string;
};

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string | null;
  destacado: number;
  disponible: number;
  categoria: string;
  categoria_slug: string;
};

type ProductosPageProps = {
  searchParams?: Promise<{
    categoria?: string;
  }>;
};

// Funciones de base de datos (sin cambios)
async function obtenerCategorias(): Promise<Categoria[]> {
  const result = await db.execute(`
    SELECT id, nombre, slug
    FROM categorias
    WHERE activo = 1
    ORDER BY orden ASC, nombre ASC
  `);

  return result.rows.map((row) => ({
    id: Number(row.id),
    nombre: String(row.nombre),
    slug: String(row.slug),
  }));
}

async function obtenerProductos(categoriaSlug?: string): Promise<Producto[]> {
  if (categoriaSlug && categoriaSlug !== "todos") {
    const result = await db.execute({
      sql: `
        SELECT 
          p.id,
          p.nombre,
          p.descripcion,
          p.precio,
          p.imagen_url,
          p.destacado,
          p.disponible,
          c.nombre AS categoria,
          c.slug AS categoria_slug
        FROM productos p
        INNER JOIN categorias c ON c.id = p.categoria_id
        WHERE c.slug = ?
        ORDER BY p.created_at DESC
      `,
      args: [categoriaSlug],
    });

    return result.rows.map((row) => ({
      id: Number(row.id),
      nombre: String(row.nombre),
      descripcion: String(row.descripcion),
      precio: Number(row.precio),
      imagen_url: row.imagen_url ? String(row.imagen_url) : null,
      destacado: Number(row.destacado),
      disponible: Number(row.disponible),
      categoria: String(row.categoria),
      categoria_slug: String(row.categoria_slug),
    }));
  }

  const result = await db.execute(`
    SELECT 
      p.id,
      p.nombre,
      p.descripcion,
      p.precio,
      p.imagen_url,
      p.destacado,
      p.disponible,
      c.nombre AS categoria,
      c.slug AS categoria_slug
    FROM productos p
    INNER JOIN categorias c ON c.id = p.categoria_id
    ORDER BY p.created_at DESC
  `);

  return result.rows.map((row) => ({
    id: Number(row.id),
    nombre: String(row.nombre),
    descripcion: String(row.descripcion),
    precio: Number(row.precio),
    imagen_url: row.imagen_url ? String(row.imagen_url) : null,
    destacado: Number(row.destacado),
    disponible: Number(row.disponible),
    categoria: String(row.categoria),
    categoria_slug: String(row.categoria_slug),
  }));
}

export default async function AdminProductosPage({
  searchParams,
}: ProductosPageProps) {
  const params = await searchParams;
  const categoriaActual = params?.categoria || "todos";

  const categorias = await obtenerCategorias();
  const productos = await obtenerProductos(categoriaActual);

  return (
    <main className="min-h-screen bg-crema px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-6 rounded-2xl border border-cafe-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1 rounded-full bg-cafe-600/10 px-4 py-2 text-sm font-semibold text-cafe-600 transition hover:bg-cafe-600 hover:text-white active:scale-[0.98]"
              >
                ← Volver
              </Link>

              <Link
                href="/admin/categorias"
                className="inline-flex items-center gap-1 rounded-full bg-cafe-100 px-4 py-2 text-sm font-semibold text-cafe-700 transition hover:bg-cafe-200 active:scale-[0.98]"
              >
                Ir a categorías
              </Link>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cafe-500">
                Gestión
              </p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl md:text-4xl text-negro">
                Productos
              </h1>
              <p className="mt-2 text-sm text-cafe-600 sm:text-base">
                Administra el catálogo de desayunos, sándwiches, bebidas y combos.
              </p>
            </div>

            <Link
              href="/admin/productos/nuevo"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cafe-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-cafe-700 active:scale-[0.98] sm:w-fit"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Nuevo producto
            </Link>
          </div>
        </header>

        {/* Filtros por categoría */}
        <section className="mb-6 rounded-2xl border border-cafe-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-cafe-500" strokeWidth={2} />
              <span className="text-sm font-bold text-cafe-700">
                Filtrar por categoría
              </span>
            </div>
            <span className="text-sm font-semibold text-cafe-400">
              {productos.length} {productos.length === 1 ? "producto" : "productos"}
            </span>
          </div>

          <div className="-mx-4 overflow-x-auto px-4 pb-1">
            <div className="flex min-w-max gap-2 sm:gap-3">
              <Link
                href="/admin/productos?categoria=todos"
                className={`rounded-full px-4 py-2 text-sm font-bold transition active:scale-[0.95] ${
                  categoriaActual === "todos"
                    ? "bg-cafe-600 text-white"
                    : "bg-cafe-100 text-cafe-700 hover:bg-cafe-200"
                }`}
              >
                Todos
              </Link>

              {categorias.map((categoria) => (
                <Link
                  key={categoria.id}
                  href={`/admin/productos?categoria=${categoria.slug}`}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition active:scale-[0.95] ${
                    categoriaActual === categoria.slug
                      ? "bg-cafe-600 text-white"
                      : "bg-cafe-100 text-cafe-700 hover:bg-cafe-200"
                  }`}
                >
                  {categoria.nombre}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Listado de productos */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black sm:text-2xl text-negro">
              Catálogo
            </h2>
            <p className="mt-1 text-sm text-cafe-500">
              Gestiona los productos registrados.
            </p>
          </div>

          {productos.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-cafe-200 bg-white p-8 text-center sm:p-10">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-cafe-100 text-4xl">
                <Coffee className="h-10 w-10 text-cafe-400" />
              </div>
              <p className="text-lg font-bold text-negro">
                No hay productos en esta categoría
              </p>
              <p className="mt-2 text-sm text-cafe-500">
                Crea tu primer producto para mostrarlo en el catálogo.
              </p>
              <Link
                href="/admin/productos/nuevo"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cafe-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-cafe-700 active:scale-[0.98] sm:w-fit"
              >
                <Plus className="h-4 w-4" />
                Crear producto
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productos.map((producto) => (
                <article
                  key={producto.id}
                  className="group overflow-hidden rounded-2xl border border-cafe-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]"
                >
                  {/* Imagen o placeholder */}
                  <div className="relative aspect-[4/3] bg-cafe-100">
                    {producto.imagen_url ? (
                      <img
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl text-cafe-300">
                        <Coffee className="h-16 w-16" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-4 sm:p-5">
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-cafe-100 px-3 py-1 text-xs font-bold text-cafe-700">
                        {producto.categoria}
                      </span>

                      {producto.destacado === 1 && (
                        <span className="rounded-full bg-negro px-3 py-1 text-xs font-bold text-white">
                          Destacado
                        </span>
                      )}

                      {producto.disponible === 1 ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          Disponible
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                          No disponible
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black leading-tight sm:text-lg text-negro line-clamp-1">
                      {producto.nombre}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm text-cafe-600">
                      {producto.descripcion}
                    </p>

                    <p className="mt-3 text-xl font-black text-cafe-600 sm:text-2xl">
                      Bs {producto.precio.toFixed(2)}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        href={`/admin/productos/editar/${producto.id}`}
                        className="flex min-h-10 items-center justify-center rounded-xl border border-cafe-300 px-3 py-2 text-sm font-bold text-cafe-700 transition hover:border-cafe-600 hover:text-cafe-600 active:scale-[0.95]"
                      >
                        Editar
                      </Link>

                      <form action={eliminarProducto}>
                        <input type="hidden" name="id" value={producto.id} />
                        <button
                          type="submit"
                          className="flex min-h-10 w-full items-center justify-center rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 active:scale-[0.95]"
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
        </section>

        {/* Footer */}
        <footer className="mt-8 border-t border-cafe-200 pt-4 sm:pt-6">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <p className="text-[9px] sm:text-[10px] md:text-xs font-medium uppercase tracking-[0.1em] text-cafe-500">
              © 2026 Gustosito
            </p>
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-cafe-300" />
              <p className="text-[9px] sm:text-[10px] md:text-xs font-medium text-cafe-400">
                Hecho con ❤️
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}