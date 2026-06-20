import { db } from "@/lib/db";
import { MenuWithFilter } from "@/components/MenuWithFilter";
import Image from "next/image";
import { Coffee } from "lucide-react";

type ProductoPublico = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string | null;
  destacado: number;
  categoria: string;
  categoria_slug: string;
};

// Funciones (sin cambios)
async function obtenerProductosPublicos(): Promise<ProductoPublico[]> {
  const result = await db.execute(`
    SELECT
      p.id,
      p.nombre,
      p.descripcion,
      p.precio,
      p.imagen_url,
      p.destacado,
      c.nombre AS categoria,
      c.slug AS categoria_slug
    FROM productos p
    INNER JOIN categorias c ON c.id = p.categoria_id
    WHERE p.disponible = 1
      AND c.activo = 1
    ORDER BY c.orden ASC, p.destacado DESC, p.created_at DESC
  `);

  return result.rows.map((row) => ({
    id: Number(row.id),
    nombre: String(row.nombre),
    descripcion: String(row.descripcion),
    precio: Number(row.precio),
    imagen_url: row.imagen_url ? String(row.imagen_url) : null,
    destacado: Number(row.destacado),
    categoria: String(row.categoria),
    categoria_slug: String(row.categoria_slug),
  }));
}

function agruparPorCategoria(productos: ProductoPublico[]) {
  const grupos: Record<string, ProductoPublico[]> = {};
  productos.forEach((producto) => {
    if (!grupos[producto.categoria]) {
      grupos[producto.categoria] = [];
    }
    grupos[producto.categoria].push(producto);
  });
  return grupos;
}

export default async function HomePage() {
  const productos = await obtenerProductosPublicos();
  const productosDestacados = productos.filter((p) => p.destacado === 1);
  const productosPorCategoria = agruparPorCategoria(productos);
  const numeroWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "591XXXXXXXX";

  // Lista de categorías únicas para los filtros
  const categoriasUnicas = Object.keys(productosPorCategoria);

  return (
    <main className="min-h-screen bg-crema text-negro">
      {/* Header fijo */}
      <header className="sticky top-0 z-50 border-b border-cafe-200 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-2xl shadow-md shadow-cafe-600/20">
              <Image
                src="/logo.png"
                alt="Gustosito Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <p className="text-lg font-black leading-none text-negro">Gustosito</p>
              <p className="text-xs font-semibold text-cafe-500">Desayunos & café</p>
            </div>
          </a>

          <a
            href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
              "Hola Gustosito, quiero hacer un pedido de desayunos."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-cafe-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cafe-700 active:scale-[0.95]"
          >
            Pedir
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-cafe-600/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cafe-600">
              <span>☀️</span>
              <span>Cafetería Gustosito</span>
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-negro sm:text-5xl md:text-6xl">
              Desayunos frescos para empezar el día con buen gusto.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-cafe-600 sm:text-lg">
              Sándwiches, bebidas calientes y combos preparados con cariño para
              tu mañana, tu oficina o tus eventos.
            </p>

            <div className="mt-7 grid gap-3 sm:flex">
              <a
                href="#menu"
                className="flex min-h-12 items-center justify-center rounded-2xl bg-cafe-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-cafe-700 active:scale-[0.98]"
              >
                Ver menú
              </a>
              <a
                href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
                  "Hola Gustosito, quiero hacer un pedido de desayunos."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center rounded-2xl border border-cafe-300 bg-white px-6 py-3 text-sm font-bold text-cafe-800 transition hover:border-cafe-600 hover:text-cafe-600 active:scale-[0.98]"
              >
                Pedir por WhatsApp
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-cafe-200 bg-white p-4 shadow-sm">
            <img
              src="/homer.gif"
              alt="Animación de Gustosito"
              className="h-[320px] w-full rounded-[1.5rem] object-cover sm:h-[420px]"
            />
          </div>
        </div>
      </section>

      {/* Destacados */}
      {productosDestacados.length > 0 && (
        <section className="px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cafe-500">Recomendados</p>
              <h2 className="mt-2 text-3xl font-black text-negro">Favoritos de la casa</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {productosDestacados.slice(0, 3).map((producto) => (
                <article
                  key={producto.id}
                  className="group overflow-hidden rounded-2xl border border-cafe-200 bg-white shadow-sm transition hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] bg-cafe-100">
                    {producto.imagen_url ? (
                      <img
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl text-cafe-300">
                        <Coffee className="h-16 w-16" strokeWidth={1.5} />
                      </div>
                    )}
                    {producto.destacado === 1 && (
                      <span className="absolute right-2 top-2 rounded-full bg-negro px-3 py-1 text-xs font-bold text-white">
                        Destacado
                      </span>
                    )}
                  </div>

                  <div className="p-4 sm:p-5">
                    <span className="inline-block rounded-full bg-cafe-100 px-3 py-1 text-xs font-bold text-cafe-700">
                      {producto.categoria}
                    </span>

                    <h3 className="mt-2 text-lg font-black text-negro line-clamp-1">{producto.nombre}</h3>

                    <p className="mt-1 line-clamp-2 text-sm text-cafe-600">{producto.descripcion}</p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-2xl font-black text-cafe-600">
                        Bs {producto.precio.toFixed(2)}
                      </p>

                      <a
                        href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
                          `Hola Gustosito, quiero pedir este producto: ${producto.nombre} - Bs ${producto.precio.toFixed(2)}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-cafe-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cafe-700 active:scale-[0.95]"
                      >
                        Pedir
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Menú con filtros y animaciones */}
      <MenuWithFilter
        productosPorCategoria={productosPorCategoria}
        categorias={categoriasUnicas}
        numeroWhatsApp={numeroWhatsApp}
      />

      {/* CTA Eventos */}
      <section className="px-4 pb-10 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-3xl bg-cafe-600 p-6 text-white sm:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-black sm:text-3xl">¿Necesitas desayunos para un evento?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-crema/80">
                Escríbenos por WhatsApp y coordinamos pedidos para reuniones, oficinas o eventos pequeños.
              </p>
            </div>

            <a
              href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
                "Hola Gustosito, quiero consultar desayunos para un evento."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-black text-cafe-600 transition hover:bg-crema active:scale-[0.98]"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cafe-200 bg-white px-4 py-6 text-center sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src="/logo.png"
                alt="Gustosito Logo"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm font-semibold text-cafe-500">
              © {new Date().getFullYear()} Gustosito — Desayunos, café y buenos momentos.
            </p>
          </div>
          <div className="mt-2 flex justify-center gap-4 text-xs text-cafe-400">
            <span>Hecho con ❤️</span>
            <span>•</span>
            <span>Bolivia</span>
          </div>
        </div>
      </footer>
    </main>
  );
}