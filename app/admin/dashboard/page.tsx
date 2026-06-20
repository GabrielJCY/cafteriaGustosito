import Link from "next/link";
import Image from "next/image";
import { Coffee, Sandwich, ArrowRight } from "lucide-react";

const opciones = [
  {
    titulo: "Categorías",
    descripcion: "Organiza secciones como sándwiches, bebidas calientes y combos.",
    href: "./categorias",
    icono: Sandwich,
    color: "cafe",
  },
  {
    titulo: "Productos",
    descripcion: "Registra desayunos, sándwiches, cafés, tés y combos.",
    href: "./productos",
    icono: Coffee,
    color: "cafe-800",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-crema px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 flex-shrink-0 overflow-hidden rounded-2xl shadow-md shadow-cafe-600/20">
                <Image
                  src="/logo.png"
                  alt="Logo Cafetería Gustosito"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-negro">
                  Gustosito
                </h1>
                <p className="text-[9px] sm:text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-cafe-600/60">
                  Cafetería
                </p>
              </div>
            </div>

            <div className="rounded-full border border-cafe-200 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-[0.1em] text-cafe-600">
                Admin
              </span>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 md:mt-6 space-y-1 sm:space-y-2">
            <p className="text-sm sm:text-base md:text-lg font-medium text-cafe-800">
              Administra tu menú y productos
            </p>
            <p className="text-xs sm:text-sm md:text-base leading-relaxed text-cafe-500">
              Gestiona categorías y productos de tu cafetería
            </p>
          </div>
        </header>

        {/* Tarjetas */}
        <section className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {opciones.map((opcion) => {
            const Icon = opcion.icono;
            const color = opcion.color;
            return (
              <Link
                key={opcion.href}
                href={opcion.href}
                className="block transition-all duration-200 active:scale-[0.98] hover:scale-[1.01] focus:scale-[1.01]"
              >
                <div
                  className={`group relative overflow-hidden rounded-2xl border border-cafe-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md active:shadow-md hover:border-${color} focus:border-${color} active:border-${color}`}
                >
                  {/* Gradiente sutil al interactuar */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-${color}/5 to-${color}/10 opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Línea superior animada */}
                  <div
                    className={`absolute left-0 top-0 h-1 w-0 bg-${color} transition-all duration-300 group-hover:w-full group-focus:w-full group-active:w-full`}
                  />

                  <div className="relative flex items-start gap-3 sm:gap-4">
                    {/* Icono */}
                    <div
                      className={`flex h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-${color}/10 transition-all duration-300 group-hover:bg-${color} group-focus:bg-${color} group-active:bg-${color} active:scale-90 focus:scale-90`}
                    >
                      <Icon
                        className={`h-5 w-5 sm:h-6 sm:w-6 text-${color} transition-colors duration-300 group-hover:text-white group-focus:text-white group-active:text-white`}
                        strokeWidth={2}
                      />
                    </div>

                    <div className="flex-1 pt-0.5">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-negro transition-colors duration-300 group-hover:text-cafe-600 group-focus:text-cafe-600 group-active:text-cafe-600">
                        {opcion.titulo}
                      </h2>

                      <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm md:text-base leading-relaxed text-cafe-700">
                        {opcion.descripcion}
                      </p>

                      {/* Acción */}
                      <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm font-semibold text-cafe-600 transition-all duration-300 group-hover:gap-3 group-focus:gap-3 group-active:gap-3">
                        <span className="relative">
                          Gestionar
                          <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-cafe-600 transition-all duration-300 group-hover:w-full group-focus:w-full group-active:w-full" />
                        </span>
                        <ArrowRight
                          className="h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 group-hover:translate-x-1 group-focus:translate-x-1 group-active:translate-x-1"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Detalle inferior */}
                  <div
                    className={`absolute bottom-0 right-0 h-10 w-10 sm:h-12 sm:w-12 rounded-tl-3xl bg-gradient-to-tl from-${color}/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100`}
                  />
                </div>
              </Link>
            );
          })}
        </section>

        {/* Taza de café decorativa (sutil) */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex justify-center items-center opacity-40 hover:opacity-60 transition-opacity duration-300">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
            <svg
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <ellipse
                cx="60"
                cy="100"
                rx="45"
                ry="12"
                stroke="#6F4E37"
                strokeWidth="2"
                fill="rgba(111,78,55,0.05)"
              />
              <ellipse
                cx="60"
                cy="98"
                rx="40"
                ry="10"
                stroke="#6F4E37"
                strokeWidth="1.5"
                fill="rgba(111,78,55,0.08)"
              />
              <ellipse
                cx="60"
                cy="105"
                rx="35"
                ry="6"
                fill="rgba(111,78,55,0.1)"
              />
              <path
                d="M30 35 L30 75 C30 90,45 95,60 95 C75 95,90 90,90 75 L90 35Z"
                stroke="#6F4E37"
                strokeWidth="2.5"
                fill="rgba(111,78,55,0.1)"
              />
              <ellipse
                cx="60"
                cy="35"
                rx="30"
                ry="8"
                stroke="#6F4E37"
                strokeWidth="2.5"
                fill="rgba(255,255,255,0.15)"
              />
              <ellipse
                cx="60"
                cy="38"
                rx="26"
                ry="6"
                fill="#6F4E37"
                opacity="0.3"
              />
              <path
                d="M36 38 Q45 33,54 38 Q63 43,72 38 Q81 33,84 38"
                stroke="#6F4E37"
                strokeWidth="2"
                fill="none"
                opacity="0.5"
              />
              <circle cx="48" cy="36" r="2.5" fill="#FBF8F4" opacity="0.6" />
              <circle cx="58" cy="34" r="2" fill="#FBF8F4" opacity="0.5" />
              <circle cx="68" cy="37" r="1.8" fill="#FBF8F4" opacity="0.4" />
              <path
                d="M90 45 C110 45,110 70,90 70"
                stroke="#6F4E37"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M90 50 C105 50,105 65,90 65"
                stroke="#FBF8F4"
                strokeWidth="1.5"
                fill="none"
                opacity="0.3"
                strokeLinecap="round"
              />
              <path
                d="M50 25 Q55 15,50 5"
                stroke="#6F4E37"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.4"
              />
              <path
                d="M60 20 Q65 10,60 0"
                stroke="#6F4E37"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                d="M70 23 Q75 13,70 3"
                stroke="#6F4E37"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.2"
              />
              <line
                x1="40"
                y1="55"
                x2="80"
                y2="55"
                stroke="#6F4E37"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.3"
              />
            </svg>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 sm:mt-8 md:mt-10 border-t border-cafe-200 pt-4 sm:pt-6">
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