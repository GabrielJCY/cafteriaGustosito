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

// Variantes con 'as const' para que Framer Motion y TypeScript funcionen bien
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

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
    <section id="menu" className="relative px-3 py-10 sm:px-6 sm:py-14">
      <div className="relative mx-auto max-w-7xl z-10">
        
        {/* Título */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cafe-100 text-cafe-600 shadow-sm"
          >
            <Coffee className="h-6 w-6" strokeWidth={2} />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tight text-negro sm:text-5xl"
          >
            Nuestro Menú
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-sm font-medium text-cafe-600/80 sm:text-base"
          >
            Explora nuestras opciones. Todo preparado al instante.
          </motion.p>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {opcionesFiltro.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all active:scale-95 sm:text-sm ${
                categoriaSeleccionada === cat
                  ? "bg-negro text-white shadow-lg shadow-negro/20"
                  : "bg-white border border-cafe-200 text-cafe-600 hover:border-cafe-400 hover:bg-cafe-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Contador */}
        <div className="mb-6 flex items-center justify-between border-b border-cafe-200/50 pb-3">
          <h3 className="text-lg font-black text-negro sm:text-xl">
            {categoriaSeleccionada === "Todas" ? "Todos los productos" : categoriaSeleccionada}
          </h3>
          <span className="rounded-full bg-cafe-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cafe-600 sm:text-xs">
            {totalProductos} {totalProductos === 1 ? "opción" : "opciones"}
          </span>
        </div>

        {totalProductos === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-cafe-200 bg-white/50 p-10 text-center backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cafe-100 shadow-inner">
              <Coffee className="h-8 w-8 text-cafe-400" />
            </div>
            <p className="text-lg font-black text-negro">
              Aún no hay productos aquí
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(productosFiltrados).map(([categoria, items]) => (
              <div key={categoria}>
                {categoriaSeleccionada === "Todas" && (
                  <h4 className="mb-5 flex items-center gap-2 text-xl font-black text-cafe-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-cafe-400"></span>
                    {categoria}
                  </h4>
                )}

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  // AQUÍ ESTÁ EL CAMBIO A 2 COLUMNAS: grid-cols-2 fijado desde móvil
                  className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
                >
                  {items.map((producto) => (
                    <motion.article
                      key={producto.id}
                      variants={itemVariants}
                      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-cafe-100 transition-all hover:shadow-xl sm:rounded-[2rem]"
                    >
                      {/* Contenedor Visual (Sin botón ni enlace) */}
                      <div className="flex h-full flex-col">
                        
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F8F5F2]">
                          {producto.imagen_url ? (
                            <img
                              src={producto.imagen_url}
                              alt={producto.nombre}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-cafe-200">
                              <Coffee className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} />
                            </div>
                          )}
                          
                          {producto.destacado === 1 && (
                            <span className="absolute left-2 top-2 rounded-full bg-negro/90 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-sm backdrop-blur-md sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs">
                              ⭐ Destacado
                            </span>
                          )}
                        </div>

                        {/* Padding ajustado para 2 columnas en celular */}
                        <div className="flex flex-1 flex-col p-3 sm:p-5">
                          <span className="mb-2 w-fit rounded-full bg-cafe-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-cafe-600 border border-cafe-100 sm:px-3 sm:py-1 sm:text-[10px]">
                            {producto.categoria}
                          </span>

                          {/* EL NOMBRE SIEMPRE SE VERÁ COMPLETO (Sin truncar) */}
                          <h4 className="mb-2 text-sm font-black leading-tight text-negro sm:text-lg">
                            {producto.nombre}
                          </h4>

                          <p className="mb-4 flex-1 text-xs font-medium leading-relaxed text-gray-500 line-clamp-2 sm:text-sm">
                            {producto.descripcion}
                          </p>

                          <div className="mt-auto border-t border-cafe-100 pt-3">
                            <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-widest text-cafe-400 sm:text-[10px]">
                              Precio
                            </span>
                            <span className="text-lg font-black text-cafe-700 sm:text-2xl">
                              Bs {producto.precio.toFixed(2)}
                            </span>
                          </div>
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