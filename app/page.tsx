import { db } from "@/lib/db";
import { MenuWithFilter } from "@/components/MenuWithFilter";
import Image from "next/image";
import { Coffee, Croissant, CakeSlice, Utensils, ArrowRight, Sparkles } from "lucide-react";
import { Fraunces, DM_Sans } from "next/font/google";

// Componentes de Shadcn UI
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Configuración de fuentes
const fraunces = Fraunces({ 
  subsets: ["latin"], 
  weight: ["400", "600", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces" 
});

const dmSans = DM_Sans({ 
  subsets: ["latin"], 
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans" 
});

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

// Funciones de obtención de datos
async function obtenerProductosPublicos(): Promise<ProductoPublico[]> {
  const result = await db.execute(`
    SELECT
      p.id, p.nombre, p.descripcion, p.precio, p.imagen_url, p.destacado,
      c.nombre AS categoria, c.slug AS categoria_slug
    FROM productos p
    INNER JOIN categorias c ON c.id = p.categoria_id
    WHERE p.disponible = 1 AND c.activo = 1
    ORDER BY c.orden ASC, p.destacado DESC, p.created_at DESC
  `);

  return result.rows.map((row) => ({
    id: Number(row.id), nombre: String(row.nombre), descripcion: String(row.descripcion),
    precio: Number(row.precio), imagen_url: row.imagen_url ? String(row.imagen_url) : null,
    destacado: Number(row.destacado), categoria: String(row.categoria), categoria_slug: String(row.categoria_slug),
  }));
}

function agruparPorCategoria(productos: ProductoPublico[]) {
  const grupos: Record<string, ProductoPublico[]> = {};
  productos.forEach((producto) => {
    if (!grupos[producto.categoria]) grupos[producto.categoria] = [];
    grupos[producto.categoria].push(producto);
  });
  return grupos;
}

export default async function HomePage() {
  const productos = await obtenerProductosPublicos();
  const productosDestacados = productos.filter((p) => p.destacado === 1);
  const productosPorCategoria = agruparPorCategoria(productos);
  const numeroWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "591XXXXXXXX";
  const categoriasUnicas = Object.keys(productosPorCategoria);

  return (
    <main className={`relative min-h-screen bg-[#FDFBF7] text-negro selection:bg-cafe-300 selection:text-negro scroll-smooth overflow-x-hidden ${fraunces.variable} ${dmSans.variable} font-sans`}>
      
      {/* ANIMACIONES NATIVAS Y FONDOS ACETERNITY */}
      <style dangerouslySetInnerHTML={{__html: `
        :root { font-family: var(--font-dm-sans), sans-serif; }
        h1, h2, h3, .font-serif { font-family: var(--font-fraunces), serif; }
        
        /* Animaciones flotantes */
        @keyframes float-1 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        @keyframes float-2 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(-5deg); } }
        @keyframes float-3 { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-25px) scale(1.05); } }
        
        /* Animación Marquee (Magic UI Style) */
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 8s ease-in-out infinite reverse; }
        .animate-float-3 { animation: float-3 7s ease-in-out infinite; }
        .animate-marquee { animation: marquee 20s linear infinite; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Fondo Dot Matrix (Aceternity Style) */
        .bg-dot-pattern {
          background-image: radial-gradient(#d4c5b9 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}} />

      {/* FONDO ANIMADO + PATRÓN DE PUNTOS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.4]" />
        <div className="absolute inset-0 opacity-[0.04] text-cafe-900">
          <Coffee className="absolute top-[10%] left-[5%] w-24 h-24 animate-float-1" />
          <Croissant className="absolute top-[20%] right-[10%] w-32 h-32 animate-float-2" />
          <CakeSlice className="absolute top-[60%] left-[15%] w-28 h-28 animate-float-3" />
          <Utensils className="absolute top-[75%] right-[5%] w-20 h-20 animate-float-1" />
        </div>
        {/* Glows de fondo */}
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cafe-200/40 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cafe-300/30 blur-[150px] mix-blend-multiply" />
      </div>
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/50 bg-white/60 px-4 py-3 backdrop-blur-xl transition-all sm:px-6 shadow-sm shadow-cafe-900/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-tr from-cafe-100 to-white shadow-md ring-1 ring-cafe-200/50 transition-transform group-active:scale-95">
              <Image src="/logo.png" alt="Gustosito Logo" fill className="object-cover p-1" priority />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-black leading-none tracking-tight text-negro">Gustosito</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cafe-500">Deli & Café</span>
            </div>
          </a>

          <Button asChild className="rounded-full shadow-lg shadow-negro/10 transition-all active:scale-95 group bg-negro hover:bg-cafe-800 hover:shadow-cafe-900/20">
            <a href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent("Hola Gustosito, quiero hacer un pedido.")}`} target="_blank" rel="noopener noreferrer">
              Contáctanos <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24 lg:py-32 overflow-hidden">
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col items-start relative z-10">
            
            <Badge variant="outline" className="mb-6 gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cafe-800 shadow-sm border-cafe-200/50">
              <Sparkles className="h-3.5 w-3.5 text-cafe-500 animate-pulse" />
              Horneado al instante
            </Badge>

            <h1 className="font-serif text-[3.25rem] font-black leading-[1.05] tracking-tight text-negro sm:text-6xl md:text-[5.5rem] drop-shadow-sm">
              El buen día <br className="hidden sm:block" />
              <span className="italic bg-gradient-to-r from-cafe-600 to-cafe-900 bg-clip-text text-transparent">comienza aquí.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-gray-600 sm:text-xl">
              Desayunos artesanales, café de especialidad y momentos preparados con cariño para tu mañana.
            </p>

            <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="rounded-2xl h-14 px-8 text-base font-bold bg-cafe-800 hover:bg-negro shadow-xl shadow-cafe-900/20 transition-all hover:-translate-y-1 active:scale-[0.98]">
                <a href="#menu">Explorar el Menú</a>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-full z-10">
            <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-cafe-300 via-cafe-100 to-transparent blur-3xl opacity-70 animate-pulse"></div>
            <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-[2.5rem] bg-white/50 backdrop-blur-sm border-[8px] border-white/80 shadow-2xl shadow-cafe-900/15 transform rotate-2 transition-transform hover:rotate-0 duration-700 ease-out">
              <img src="/homer.gif" alt="Animación de Gustosito" className="h-full w-full object-cover scale-[1.02]" />
              <div className="absolute inset-0 mix-blend-overlay bg-gradient-to-t from-cafe-900/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE INFINITO (MAGIC UI STYLE) */}
      <div className="relative z-20 flex w-full flex-col items-center justify-center overflow-hidden bg-negro py-4 shadow-2xl -rotate-2 scale-110">
        <div className="flex w-full whitespace-nowrap animate-marquee text-cafe-100">
          {/* Duplicamos el contenido para crear el efecto infinito suave */}
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-8 px-4 text-xs sm:text-sm font-bold uppercase tracking-[0.3em]">
              <span>✦ Café de Especialidad</span>
              <span>✦ Desayunos con gustito</span>
              <span>✦ Para el frío</span>
              <span>✦ Eventos </span>
              <span>✦ Variedades</span>
            </div>
          ))}
        </div>
      </div>

      {/* DESTACADOS (Carrusel / Grilla con Efecto Glassmorphism) */}
      {productosDestacados.length > 0 && (
        <section className="relative z-10 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-cafe-200/50 pb-6">
              <div>
                <h2 className="font-serif text-4xl font-black tracking-tight text-negro sm:text-5xl">Favoritos</h2>
                <p className="mt-2 text-sm font-bold uppercase tracking-widest text-cafe-500">Nuestras joyas de la corona</p>
              </div>
            </div>

            {/* Contenedor Carrusel */}
            <div className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-12 pt-4 no-scrollbar md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-8 md:overflow-visible md:snap-none">
              {productosDestacados.slice(0, 4).map((producto) => (
                <Card 
                  key={producto.id} 
                  className="group relative flex w-[85vw] shrink-0 snap-center flex-col overflow-hidden rounded-[2rem] border-2 border-white/60 bg-white/60 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-cafe-400/20 transition-all duration-500 ease-out hover:-translate-y-2 md:w-auto"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-cafe-50/50 rounded-t-[1.8rem]">
                    {producto.imagen_url ? (
                      <img src={producto.imagen_url} alt={producto.nombre} className="h-full w-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-cafe-200">
                        <Coffee className="h-12 w-12 sm:h-16 sm:w-16" strokeWidth={1} />
                      </div>
                    )}
                    
                    {/* Gradiente oscuro sutil en la imagen para contraste */}
                    <div className="absolute inset-0 bg-gradient-to-t from-negro/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    
                    <Badge variant="secondary" className="absolute left-3 top-3 bg-white/95 text-negro backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg">
                      ⭐ Estrella
                    </Badge>
                  </div>

                  <CardContent className="flex flex-1 flex-col p-5 sm:p-6 pb-6 relative z-10 bg-gradient-to-b from-white/40 to-white/90">
                    <Badge variant="outline" className="mb-3 w-fit text-[9px] font-bold uppercase tracking-[0.2em] text-cafe-600 border-cafe-200/60 bg-cafe-50/80">
                      {producto.categoria}
                    </Badge>
                    
                    <h3 className="font-serif text-lg font-black leading-tight text-negro sm:text-xl transition-colors group-hover:text-cafe-900">
                      {producto.nombre}
                    </h3>
                    
                    <p className="mt-2 mb-4 flex-1 text-xs font-medium leading-relaxed text-gray-500 sm:text-sm line-clamp-2">
                      {producto.descripcion}
                    </p>

                    <div className="mt-auto border-t border-cafe-200/50 pt-4 flex items-center justify-between">
                      <span className="text-xl font-black text-cafe-800 sm:text-2xl">
                        Bs {producto.precio.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MENÚ IMPORTADO */}
      <section id="menu" className="relative z-10 scroll-mt-24 pb-16">
        <MenuWithFilter
          productosPorCategoria={productosPorCategoria}
          categorias={categoriasUnicas}
          numeroWhatsApp={numeroWhatsApp}
        />
      </section>

      {/* CTA EVENTOS (Aceternity Glow Effect) */}
      <section className="relative z-10 px-4 pb-20 pt-4 sm:px-6">
        <Card className="mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-negro px-6 py-14 text-white shadow-2xl sm:px-16 sm:py-24 relative border-none group">
          {/* Brillos animados interactivos */}
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-cafe-700/30 blur-[100px] transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-cafe-500/20 blur-[100px] transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-dot-pattern opacity-10" />
          
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center z-10">
            <div className="max-w-2xl">
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.3em] text-cafe-400">Corporativo & Catering</span>
              <h2 className="font-serif text-4xl font-black leading-tight sm:text-5xl md:text-6xl text-white">
                ¿Reunión de oficina o evento especial?
              </h2>
              <p className="mt-5 text-base font-medium leading-relaxed text-gray-300 sm:text-lg">
                Coordinamos pedidos al por mayor. Desayunos impecables para que tu equipo o invitados empiecen el día con la mejor energía, presentados a la perfección.
              </p>
            </div>

            <Button asChild size="lg" variant="secondary" className="h-14 rounded-2xl px-8 text-base font-black text-negro hover:scale-105 active:scale-95 transition-all shadow-xl bg-white hover:bg-cafe-50">
              <a href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent("Hola Gustosito, quiero cotizar desayunos para un evento/reunión.")}`} target="_blank" rel="noopener noreferrer">
                Cotizar ahora
              </a>
            </Button>
          </div>
        </Card>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-cafe-200/50 bg-white/80 backdrop-blur-xl px-4 py-12 text-center sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-gradient-to-tr from-cafe-100 to-white shadow-md ring-1 ring-cafe-200/50">
              <Image src="/logo.png" alt="Gustosito Logo" fill className="object-cover p-1.5" />
            </div>
            <p className="font-serif text-2xl font-black text-negro">Gustosito</p>
          </div>
          
          <p className="max-w-sm text-sm font-medium text-gray-500">
            © {new Date().getFullYear()} Gustosito. Desayunos de autor, café de especialidad y buenos momentos garantizados.
          </p>
          
          <div className="mt-4 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-cafe-400">
            <span>Bolivia</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cafe-300"></span>
            <span>Hecho con amor</span>
          </div>
        </div>
      </footer>
    </main>
  );
}