"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Minus, Plus, ShoppingCart, X, Trash2, QrCode, ArrowLeft, Check, Copy, Download, Maximize2, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { useProductosTraducidos } from "./ProductosTraducidosProvider";

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
  numeroWhatsApp: string; // Conservado para mantener compatibilidad con HomePage.
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
} as const;

const dinero = (valor: number) => `Bs ${valor.toFixed(2)}`;

export function MenuWithFilter({ productosPorCategoria, categorias }: MenuWithFilterProps) {
  const { idioma } = useLanguage();
  const { traducir, cargando, error } = useProductosTraducidos();
  const en = idioma === "en";
  const [descripcionAbierta, setDescripcionAbierta] = useState<Record<number, boolean>>({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [carrito, setCarrito] = useState<Record<number, number>>({});
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [ultimoAgregado, setUltimoAgregado] = useState<number | null>(null);
  const [montoCopiado, setMontoCopiado] = useState(false);
  const [qrDisponible, setQrDisponible] = useState(true);

  const productos = useMemo(
    () => Object.values(productosPorCategoria).flat(),
    [productosPorCategoria]
  );
  const productosFiltrados = useMemo(() => {
    if (categoriaSeleccionada === "Todas") return productosPorCategoria;
    const encontrados = productosPorCategoria[categoriaSeleccionada];
    return encontrados ? { [categoriaSeleccionada]: encontrados } : {};
  }, [productosPorCategoria, categoriaSeleccionada]);

  const totalProductos = Object.values(productosFiltrados).reduce((a, items) => a + items.length, 0);
  const opcionesFiltro = ["Todas", ...categorias.filter((cat) => cat !== "Todas")];

  const lineas = useMemo(
    () => productos
      .filter((producto) => (carrito[producto.id] ?? 0) > 0)
      .map((producto) => ({ ...producto, cantidad: carrito[producto.id] })),
    [productos, carrito]
  );
  const cantidadTotal = lineas.reduce((total, producto) => total + producto.cantidad, 0);
  const total = lineas.reduce((suma, producto) => suma + producto.precio * producto.cantidad, 0);

  const cambiarCantidad = (id: number, diferencia: number) => {
    setCarrito((anterior) => {
      const nuevaCantidad = Math.max(0, (anterior[id] ?? 0) + diferencia);
      const actualizado = { ...anterior };
      if (nuevaCantidad === 0) delete actualizado[id];
      else actualizado[id] = nuevaCantidad;
      return actualizado;
    });
    setMostrarQR(false); // Evita dejar visible un importe anterior al modificar el carrito.
    setMontoCopiado(false);
  };

  const agregar = (id: number) => {
    cambiarCantidad(id, 1);
    setUltimoAgregado(id);
  };

  const copiarMonto = async () => {
    try {
      await navigator.clipboard.writeText(total.toFixed(2));
      setMontoCopiado(true);
    } catch {
      setMontoCopiado(false);
    }
  };

  const cerrarCarrito = () => {
    setCarritoAbierto(false);
    setMostrarQR(false);
  };

  useEffect(() => {
    if (!carritoAbierto) return;
    const alPresionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") cerrarCarrito();
    };
    window.addEventListener("keydown", alPresionarTecla);
    return () => window.removeEventListener("keydown", alPresionarTecla);
  }, [carritoAbierto]);

  return (
    <section id="menu" className="relative px-3 py-10 sm:px-6 sm:py-14">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cafe-100 text-cafe-600 shadow-sm"
          >
            <Coffee className="h-6 w-6" strokeWidth={2} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tight text-negro sm:text-5xl"
          >
            {en ? "Our Menu" : "Nuestro Menú"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }} className="mt-3 text-sm font-medium text-cafe-600/80 sm:text-base"
          >
            {en ? "Find something delicious. Everything made fresh." : "Explora nuestras opciones. Todo preparado al instante."}
          </motion.p>
        </div>

        {en && cargando && <p role="status" className="mb-3 text-center text-xs text-cafe-600">Translating menu…</p>}
        {en && error && <p role="status" className="mb-3 text-center text-xs text-amber-700">Automatic translation is temporarily unavailable. Some text may remain in Spanish.</p>}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {opcionesFiltro.map((cat) => (
            <button key={cat} type="button" onClick={() => setCategoriaSeleccionada(cat)}
              aria-pressed={categoriaSeleccionada === cat}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all active:scale-95 sm:text-sm ${
                categoriaSeleccionada === cat
                  ? "bg-negro text-white shadow-lg shadow-negro/20"
                  : "border border-cafe-200 bg-white text-cafe-600 hover:border-cafe-400 hover:bg-cafe-50"
              }`}
            >
              {cat === "Todas" ? (en ? "All" : "Todas") : traducir(cat)}
            </button>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between border-b border-cafe-200/50 pb-3">
          <h3 className="text-lg font-black text-negro sm:text-xl">
            {categoriaSeleccionada === "Todas" ? (en ? "All products" : "Todos los productos") : traducir(categoriaSeleccionada)}
          </h3>
          <span className="rounded-full bg-cafe-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cafe-600 sm:text-xs">
            {totalProductos} {totalProductos === 1 ? (en ? "option" : "opción") : (en ? "options" : "opciones")}
          </span>
        </div>

        {totalProductos === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-cafe-200 bg-white/50 p-10 text-center backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cafe-100 shadow-inner">
              <Coffee className="h-8 w-8 text-cafe-400" />
            </div>
            <p className="text-lg font-black text-negro">{en ? "No products here yet" : "Aún no hay productos aquí"}</p>
          </div>
        ) : (
          <div className="space-y-12 pb-24">
            {Object.entries(productosFiltrados).map(([categoria, items]) => (
              <div key={categoria}>
                {categoriaSeleccionada === "Todas" && (
                  <h4 className="mb-5 flex items-center gap-2 text-xl font-black text-cafe-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-cafe-400" />{traducir(categoria)}
                  </h4>
                )}
                <motion.div variants={containerVariants} initial="hidden" whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
                >
                  {items.map((producto) => (
                    <motion.article key={producto.id} variants={itemVariants}
                      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-cafe-100 transition-all hover:shadow-xl sm:rounded-[2rem]"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F8F5F2]">
                        {producto.imagen_url ? (
                          <img src={producto.imagen_url} alt={producto.nombre}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-cafe-200">
                            <Coffee className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} />
                          </div>
                        )}
                        {producto.destacado === 1 && (
                          <span className="absolute left-2 top-2 rounded-full bg-negro/90 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-sm backdrop-blur-md sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs">
                            {en ? "⭐ Featured" : "⭐ Destacado"}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-3 sm:p-5">
                        <span className="mb-2 w-fit rounded-full border border-cafe-100 bg-cafe-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-cafe-600 sm:px-3 sm:py-1 sm:text-[10px]">
                          {traducir(producto.categoria)}
                        </span>
                        <h4 className="mb-2 text-sm font-black leading-tight text-negro sm:text-lg">{traducir(producto.nombre)}</h4>
                        <div className="mb-4 flex-1">
                          <p className={`text-xs font-medium leading-relaxed text-gray-600 sm:text-sm ${descripcionAbierta[producto.id] ? "" : "line-clamp-3"}`}>
                            {traducir(producto.descripcion)}
                          </p>
                          {traducir(producto.descripcion).length > 70 && (
                            <button type="button" aria-expanded={!!descripcionAbierta[producto.id]}
                              onClick={() => setDescripcionAbierta(a => ({ ...a, [producto.id]: !a[producto.id] }))}
                              className="mt-2 inline-flex min-h-8 items-center gap-1 text-xs font-bold text-cafe-800 underline underline-offset-4">
                              {descripcionAbierta[producto.id] ? (en ? "Show less" : "Ver menos") : (en ? "Read more" : "Leer más")}
                              {descripcionAbierta[producto.id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                          )}
                        </div>
                        <div className="mt-auto border-t border-cafe-100 pt-3">
                          <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-widest text-cafe-400 sm:text-[10px]">{en ? "Price" : "Precio"}</span>
                          <span className="text-lg font-black text-cafe-700 sm:text-2xl">{dinero(producto.precio)}</span>
                          <button type="button" onClick={() => agregar(producto.id)}
                            className="mt-3 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-negro px-2 py-2 text-xs font-bold text-white transition-all hover:bg-cafe-800 active:scale-95 sm:text-sm"
                            aria-label={`Añadir ${producto.nombre} al carrito`}
                          >
                            {ultimoAgregado === producto.id ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            {en ? "Add" : "Añadir"}{(carrito[producto.id] ?? 0) > 0 ? ` (${carrito[producto.id]})` : ""}
                          </button>
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

      {cantidadTotal > 0 && !carritoAbierto && (
        <div className="fixed inset-x-3 bottom-4 z-[60] mx-auto max-w-md sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-80">
          <button type="button" onClick={() => setCarritoAbierto(true)}
            className="flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl bg-negro px-5 py-3 font-bold text-white shadow-2xl shadow-negro/30 transition-transform active:scale-95"
          >
            <span className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> {en ? "View cart" : "Ver carrito"} ({cantidadTotal})</span>
            <span>{dinero(total)}</span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {carritoAbierto && (
          <div className="fixed inset-0 z-[100]">
            <motion.button type="button" aria-label="Cerrar carrito" onClick={cerrarCarrito}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 h-full w-full bg-black/50 backdrop-blur-sm" />
            <motion.div role="dialog" aria-modal="true" aria-label={mostrarQR ? (en ? "QR payment" : "Pago con QR") : (en ? "Your cart" : "Tu carrito")}
              initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col overflow-hidden rounded-t-[2rem] bg-[#FDFBF7] shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-full sm:max-w-md sm:rounded-none"
            >
              <div className="flex items-center justify-between border-b border-cafe-100 px-5 py-5">
                <div className="flex items-center gap-2">
                  {mostrarQR && (
                    <button type="button" onClick={() => setMostrarQR(false)} aria-label="Volver al carrito"
                      className="rounded-lg p-2 hover:bg-cafe-100"><ArrowLeft className="h-5 w-5" /></button>
                  )}
                  <h2 className="text-xl font-black text-negro">{mostrarQR ? (en ? "Pay with QR" : "Pagar con QR") : (en ? "Your cart" : "Tu carrito")}</h2>
                </div>
                <button type="button" onClick={cerrarCarrito} aria-label="Cerrar carrito"
                  className="rounded-xl p-2 hover:bg-cafe-100"><X className="h-6 w-6" /></button>
              </div>

              {mostrarQR ? (
                <div className="flex-1 space-y-5 overflow-y-auto px-5 py-7 text-center">
                  <QrCode className="mx-auto h-9 w-9 text-cafe-700" />
                  <p className="text-sm text-gray-600">{en ? "Scan the cafe’s QR code using your banking app." : "Escanea el QR de la cafetería desde tu aplicación bancaria."}</p>
                  <div className="mx-auto max-w-xs rounded-2xl border border-cafe-200 bg-white p-4 shadow-sm">
                    {qrDisponible ? (
                      <img
                        src="/qr-pago.png"
                        alt="QR bancario de cobro de Gustosito"
                        className="aspect-square w-full object-contain"
                        onError={() => setQrDisponible(false)}
                      />
                    ) : (
                      <div role="alert" className="flex aspect-square items-center justify-center rounded-xl bg-cafe-50 p-5 text-sm text-cafe-800">
                        {en ? "Add the owner’s QR image to public/qr-pago.png." : "Aún falta colocar la imagen del QR del propietario en public/qr-pago.png."}
                      </div>
                    )}
                  </div>
                  {qrDisponible && (
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href="/qr-pago.png"
                        download="Gustosito-QR-pago.png"
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-negro px-3 py-2 text-xs font-bold text-white sm:text-sm"
                      >
                        <Download className="h-4 w-4" /> {en ? "Save QR" : "Guardar QR"}
                      </a>
                      <a
                        href="/qr-pago.png"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cafe-200 bg-white px-3 py-2 text-xs font-bold text-cafe-800 sm:text-sm"
                      >
                        <Maximize2 className="h-4 w-4" /> {en ? "Enlarge QR" : "Ampliar QR"}
                      </a>
                    </div>
                  )}
                  <div className="rounded-2xl bg-cafe-100 p-4">
                    <p className="text-sm font-semibold text-cafe-700">{en ? "Amount to enter" : "Importe que debes ingresar"}</p>
                    <p className="text-3xl font-black text-negro">{dinero(total)}</p>
                    <button
                      type="button"
                      onClick={copiarMonto}
                      className="mx-auto mt-3 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cafe-300 bg-white px-4 text-sm font-bold text-cafe-800"
                    >
                      {montoCopiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {montoCopiado ? (en ? "Amount copied" : "Monto copiado") : (en ? "Copy amount" : "Copiar monto")}
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-500">
                    {en ? "On the same phone? Save the QR image and import it into your banking app, if supported. This is a fixed QR: manually enter the amount shown." : "Si estás usando el mismo celular para pagar, guarda la imagen del QR y selecciónala desde tu aplicación bancaria, si esta lo permite. El QR es fijo: deberás introducir manualmente el importe indicado."}
                  </p>
                  <p className="text-xs font-semibold leading-relaxed text-cafe-800">
                    {en ? "Gustosito does not process or verify payments automatically. Staff must check the payment before handing over the order." : "Gustosito no cobra ni verifica pagos automáticamente. Antes de entregar el pedido, el encargado debe comprobar que recibió el pago."}
                  </p>
                </div>
              ) : (
                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                  {lineas.length === 0 ? (
                    <div className="py-16 text-center text-gray-500">{en ? "Your cart is empty." : "Tu carrito está vacío."}</div>
                  ) : lineas.map((producto) => (
                    <div key={producto.id} className="flex items-center gap-3 rounded-2xl border border-cafe-100 bg-white p-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cafe-50">
                        {producto.imagen_url ? (
                          <img src={producto.imagen_url} alt="" className="h-full w-full object-cover" />
                        ) : <Coffee className="m-auto mt-4 text-cafe-300" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-negro">{traducir(producto.nombre)}</h3>
                        <p className="text-sm font-black text-cafe-700">{dinero(producto.precio * producto.cantidad)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => cambiarCantidad(producto.id, -1)} aria-label={`Quitar uno de ${producto.nombre}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-cafe-200"><Minus className="h-4 w-4" /></button>
                        <span className="min-w-4 text-center text-sm font-black">{producto.cantidad}</span>
                        <button type="button" onClick={() => cambiarCantidad(producto.id, 1)} aria-label={`Añadir uno de ${producto.nombre}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-cafe-200"><Plus className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                  {lineas.length > 0 && (
                    <button type="button" onClick={() => { setCarrito({}); setMostrarQR(false); }}
                      className="flex items-center gap-2 text-sm font-semibold text-red-600"><Trash2 className="h-4 w-4" /> {en ? "Empty cart" : "Vaciar carrito"}</button>
                  )}
                </div>
              )}

              {!mostrarQR && (
                <div className="border-t border-cafe-200 bg-white px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                  <div className="mb-4 flex items-center justify-between text-lg font-black text-negro">
                    <span>{en ? "Total to pay" : "Total a pagar"}</span><span>{dinero(total)}</span>
                  </div>
                  <button type="button" disabled={lineas.length === 0} onClick={() => setMostrarQR(true)}
                    className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-negro py-3 font-bold text-white hover:bg-cafe-800 disabled:cursor-not-allowed disabled:opacity-40"
                  ><QrCode className="h-5 w-5" /> {en ? "View QR to pay" : "Ver QR para pagar"}</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
