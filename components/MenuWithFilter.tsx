"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
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

type MenuWithFilterProps = {
  productosPorCategoria: Record<string, ProductoPublico[]>;
  categorias: string[];
  numeroWhatsApp: string;
};

// Función para crear el mensaje de WhatsApp (definida en el cliente)
function crearMensajeWhatsApp(producto?: ProductoPublico) {
  const mensaje = producto
    ? `Hola Gustosito, quiero pedir este producto: ${producto.nombre} - Bs ${producto.precio.toFixed(2)}`
    : "Hola Gustosito, quiero hacer un pedido de desayunos.";
  return encodeURIComponent(mensaje);
}

// Variantes con 'as const' para que TypeScript infiera los tipos correctamente
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

// Variantes con 'as const' para evitar errores de TypeScript
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
} as const;

export function MenuWithFilter({
  productosPorCategoria,
  categorias,
  numeroWhatsApp,
}: MenuWithFilterProps) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("Todas");

  const productosFiltrados = useMemo(() => {
    if (categoriaSeleccionada === "Todas") {
      return productosPorCategoria;
    }
    if (productosPorCategoria[categoriaSeleccionada]) {
      return { [categoriaSeleccionada]: productosPorCategoria[categoriaSeleccionada] };
    }
    return {};
  }, [productosPorCategoria, categoriaSeleccionada]);

  const totalProductos = Object.values(productosFiltrados).reduce(
    (acc, items) => acc + items.length,
    0
  );

  const opcionesFiltro = ["Todas", ...categorias];

  return (
    <section id="menu" className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        {/* Título y descripción */}
        <div className="mb-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-black uppercase tracking-[0.2em] text-cafe-500"
          >
            Menú
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-3xl font-black text-negro sm:text-4xl"
          >
            Nuestro MENÚ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-sm text-cafe-600"
          >
            Elige tu desayuno favorito y escríbenos por WhatsApp.
          </motion.p>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {opcionesFiltro.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition active:scale-[0.95] ${
                categoriaSeleccionada === cat
                  ? "bg-cafe-600 text-white shadow-md"
                  : "bg-cafe-100 text-cafe-700 hover:bg-cafe-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Contador */}
        <div className="mb-6 text-center text-sm text-cafe-500">
          {totalProductos} {totalProductos === 1 ? "producto" : "productos"} disponibles
        </div>

        {totalProductos === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-cafe-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-cafe-100">
              <Coffee className="h-10 w-10 text-cafe-400" />
            </div>
            <p className="text-lg font-bold text-negro">
              No hay productos en esta categoría
            </p>
            <p className="mt-2 text-sm text-cafe-500">
              Pronto agregaremos más opciones para ti.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(productosFiltrados).map(([categoria, items]) => (
              <div key={categoria}>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-negro">{categoria}</h3>
                    <p className="mt-1 text-sm text-cafe-500">{items.length} productos</p>
                  </div>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                >
                  {items.map((producto) => (
                    <motion.article
                      key={producto.id}
                      variants={itemVariants}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className="group overflow-hidden rounded-2xl border border-cafe-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
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

                      <div className="p-4">
                        <span className="inline-block rounded-full bg-cafe-100 px-3 py-1 text-xs font-bold text-cafe-700">
                          {producto.categoria}
                        </span>

                        <h4 className="mt-2 text-base font-black text-negro line-clamp-1 sm:text-lg">
                          {producto.nombre}
                        </h4>

                        <p className="mt-1 line-clamp-2 text-sm text-cafe-600">
                          {producto.descripcion}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <p className="text-xl font-black text-cafe-600 sm:text-2xl">
                            Bs {producto.precio.toFixed(2)}
                          </p>

                          <a
                            href={`https://wa.me/${numeroWhatsApp}?text=${crearMensajeWhatsApp(producto)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-cafe-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cafe-700 active:scale-[0.95]"
                          >
                            Pedir
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}