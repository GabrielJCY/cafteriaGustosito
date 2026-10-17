import { ProductosTraducidosProvider } from "@/components/ProductosTraducidosProvider";
import { LanguageProvider, LanguageSwitcher, Texto } from "@/components/LanguageProvider";
import { HeroGustosito } from "@/components/HeroGustosito";
import { ProductoTraducido } from "@/components/ProductoTraducido";
import { MenuWithFilter } from "@/components/MenuWithFilter";
import { db } from "@/lib/db";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Coffee, Sparkles } from "lucide-react";
import { Fraunces, DM_Sans } from "next/font/google";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "600", "800", "900"], style: ["normal", "italic"], variable: "--font-fraunces" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-dm-sans" });

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

async function obtenerProductosPublicos(): Promise<ProductoPublico[]> {
  const result = await db.execute(`
    SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen_url, p.destacado,
      c.nombre AS categoria, c.slug AS categoria_slug
    FROM productos p
    INNER JOIN categorias c ON c.id = p.categoria_id
    WHERE p.disponible = 1 AND c.activo = 1
    ORDER BY c.orden ASC, p.destacado DESC, p.created_at DESC
  `);
  return result.rows.map((row) => ({
    id: Number(row.id),
    nombre: String(row.nombre),
    descripcion: String(row.descripcion ?? ""),
    precio: Number(row.precio),
    imagen_url: row.imagen_url ? String(row.imagen_url) : null,
    destacado: Number(row.destacado),
    categoria: String(row.categoria),
    categoria_slug: String(row.categoria_slug),
  }));
}

function agruparPorCategoria(productos: ProductoPublico[]) {
  const grupos: Record<string, ProductoPublico[]> = {};
  for (const producto of productos) {
    (grupos[producto.categoria] ??= []).push(producto);
  }
  return grupos;
}

export default async function HomePage() {
  const productos = await obtenerProductosPublicos();
  const destacados = productos.filter((p) => p.destacado === 1);
  const mostrarFavoritos = (destacados.length ? destacados : productos).slice(0, 4);
  const imagenHero = (destacados.find((p) => p.imagen_url) ?? productos.find((p) => p.imagen_url));
  const productosPorCategoria = agruparPorCategoria(productos);
  const categoriasUnicas = Object.keys(productosPorCategoria);
  const numeroWhatsApp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  const linkWhatsApp = numeroWhatsApp ? `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent("Hola Gustosito, quisiera hacer una consulta.")}` : null;

  return (
    <LanguageProvider>
      <ProductosTraducidosProvider productos={productos}>
        <main className={`min-h-screen overflow-x-hidden bg-[#F8F3EB] text-[#26190f] selection:bg-[#d9ac7f] ${fraunces.variable} ${dmSans.variable} font-sans`}>
          <style>{`html{scroll-behavior:smooth} :root{font-family:var(--font-dm-sans),sans-serif} h1,h2,h3,.font-serif{font-family:var(--font-fraunces),serif} @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}</style>

          {/* Header legible sobre la fotografía; móvil primero. */}
          <header className="absolute inset-x-0 top-0 z-50 border-b border-white/15 bg-[#21150f]/40 text-white backdrop-blur-xl">
            <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-9 lg:px-12">
              <a href="#inicio" className="group flex min-w-0 items-center gap-2.5" aria-label="Gustosito, inicio">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/30 bg-white p-1">
                  <Image src="/logo.png" alt="Gustosito" fill className="object-contain p-1" priority />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-serif text-xl font-black tracking-tight">Gustosito</span>
                  <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.25em] text-[#e4b98d]">DELI & CAFÉ</span>
                </div>
              </a>
              <nav className="hidden items-center gap-7 text-xs font-semibold text-white/85 md:flex" aria-label="Navegación principal">
                <a href="#favoritos" className="hover:text-[#e5b581]"><Texto es="Favoritos" en="Favorites" /></a>
                <a href="#menu" className="hover:text-[#e5b581]"><Texto es="Menú" en="Menu" /></a>
                <a href="#contacto" className="hover:text-[#e5b581]"><Texto es="Contacto" en="Contact" /></a>
              </nav>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <a href="#menu" className="hidden min-h-10 items-center gap-2 rounded-full bg-[#e7ba89] px-5 text-xs font-extrabold text-[#2a190f] transition hover:bg-[#f4d0a8] sm:inline-flex">
                  <Texto es="Ver menú" en="See menu" /><ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </header>

          <div id="inicio"><HeroGustosito imagenPrincipal={imagenHero?.imagen_url} nombrePrincipal={imagenHero?.nombre} /></div>

          {/* Franja de identidad, sin marquee animado intrusivo. */}
          <div className="border-y border-[#dbc8b6] bg-[#ead7c0] px-4 py-4">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-9 gap-y-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#6f4831] sm:justify-between sm:text-xs">
              <span>✦ <Texto es="Desayunos con cariño" en="Breakfasts made with love" /></span>
              <span>✦ <Texto es="Café para disfrutar" en="Coffee worth savoring" /></span>
              <span>✦ <Texto es="Un gustito a cualquier hora" en="A treat anytime" /></span>
            </div>
          </div>

          {mostrarFavoritos.length > 0 && (
            <section id="favoritos" className="scroll-mt-8 px-4 py-16 sm:px-9 sm:py-24 lg:px-12">
              <div className="mx-auto max-w-7xl">
                <div className="mb-9 flex flex-wrap items-end justify-between gap-5 sm:mb-12">
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#98633f]"><Sparkles className="h-4 w-4"/><Texto es="Elegidos para ti" en="Picked for you"/></p>
                    <h2 className="font-serif text-[clamp(2.6rem,8vw,5.2rem)] font-black leading-[0.96] tracking-[-0.055em]"><Texto es="Los más queridos." en="Crowd favorites."/></h2>
                  </div>
                  <a href="#menu" className="inline-flex items-center gap-2 border-b border-[#7d4e31] pb-1 text-sm font-bold text-[#75462c] transition hover:gap-3"><Texto es="Explorar todo" en="Explore everything"/><ArrowUpRight className="h-4 w-4"/></a>
                </div>
                <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
                  {mostrarFavoritos.map((producto, i) => (
                    <article key={producto.id} className="group w-[76vw] max-w-[325px] shrink-0 snap-start overflow-hidden rounded-[1.6rem] border border-[#e5d8c9] bg-white shadow-[0_10px_35px_rgba(74,42,18,0.06)] transition hover:-translate-y-1 hover:shadow-xl sm:w-auto sm:max-w-none">
                      <a href="#menu" className="block" aria-label={`Ver ${producto.nombre} en el menú`}>
                        <div className="relative aspect-[5/4] overflow-hidden bg-[#e6d6c5]">
                          {producto.imagen_url ? <img src={producto.imagen_url} alt={producto.nombre} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center"><Coffee className="h-16 w-16 text-[#9b6b4e]"/></div>}
                          <span className="absolute left-4 top-4 rounded-full bg-[#26190f] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white">{String(i + 1).padStart(2, "0")}</span>
                        </div>
                        <div className="space-y-2 p-5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#976746]"><ProductoTraducido id={producto.id} campo="categoria" original={producto.categoria}/></p>
                          <h3 className="font-serif text-xl font-bold leading-tight"><ProductoTraducido id={producto.id} campo="nombre" original={producto.nombre}/></h3>
                          <div className="flex items-center justify-between pt-2"><span className="text-lg font-black text-[#7c4e31]">Bs {producto.precio.toFixed(2)}</span><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#26190f] text-white"><ArrowUpRight className="h-4 w-4"/></span></div>
                        </div>
                      </a>
                    </article>
                  ))}
                </div>
                <p className="mt-3 text-xs text-[#8b6c55] sm:hidden"><ArrowDown className="mr-1 inline h-3 w-3 -rotate-90"/><Texto es="Desliza para ver más" en="Swipe to see more"/></p>
              </div>
            </section>
          )}

          <div className="bg-[#fffcf8]">
            <div className="mx-auto max-w-7xl px-4 pt-16 text-center sm:px-9 sm:pt-20">
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.23em] text-[#976746]"><Texto es="Elige a tu gusto" en="Made for your cravings"/></p>
              <h2 className="font-serif text-[clamp(2.8rem,8vw,5.5rem)] font-black leading-none tracking-[-0.06em]"><Texto es="¿Qué se te antoja?" en="What are you craving?"/></h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-[#836a58] sm:text-base"><Texto es="Explora, añade al carrito y consulta tu total. Sin complicaciones." en="Browse, add to your cart and see your total. Simple as that."/></p>
            </div>
            <div id="menu" className="scroll-mt-20"><MenuWithFilter productosPorCategoria={productosPorCategoria} categorias={categoriasUnicas} numeroWhatsApp={numeroWhatsApp}/></div>
          </div>

          <section id="contacto" className="scroll-mt-16 bg-[#26190f] px-5 py-16 text-[#fff7ec] sm:px-9 sm:py-24 lg:px-12">
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 border-b border-white/15 pb-14 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="mb-5 text-[11px] font-black uppercase tracking-[0.25em] text-[#e7ba89]"><Texto es="Un antojo nos une" en="Good food brings us together"/></p>
                <h2 className="font-serif text-[clamp(2.8rem,8vw,5.8rem)] font-black leading-[0.97] tracking-[-0.05em]"><Texto es="Siempre hay tiempo para un gustito." en="There's always time for a little treat."/></h2>
              </div>
              {linkWhatsApp && <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center gap-3 rounded-full bg-[#e7ba89] px-7 text-sm font-extrabold text-[#24170f] transition hover:bg-[#f4d0a8]"><Texto es="Escríbenos" en="Get in touch"/><ArrowUpRight className="h-5 w-5"/></a>}
            </div>
            <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 pt-9 text-xs text-[#d6bea8]">
              <div className="flex items-center gap-3"><Image src="/logo.png" width={36} height={36} alt="Gustosito" className="rounded-full bg-white p-1"/><span className="font-serif text-lg font-black text-white">Gustosito</span></div>
              <span>© {new Date().getFullYear()} Gustosito · La Paz, Bolivia</span>
              <span><Texto es="Hecho con cariño" en="Made with love"/></span>
            </footer>
          </section>
        </main>
      </ProductosTraducidosProvider>
    </LanguageProvider>
  );
}
