"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Coffee, Sparkles } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

type HeroProps = {
  imagenPrincipal?: string | null;
  nombrePrincipal?: string;
};

export function HeroGustosito({ imagenPrincipal, nombrePrincipal }: HeroProps) {
  const { idioma } = useLanguage();
  const en = idioma === "en";

  return (
    <section className="relative isolate min-h-[650px] overflow-hidden bg-[#21150f] text-[#fffaf1] sm:min-h-[700px] lg:min-h-[760px]">
      {/* La fotografía utiliza uno de los productos reales de Gustosito. */}
      {imagenPrincipal ? (
        <div className="absolute inset-0 lg:left-[42%]">
          <img src={imagenPrincipal} alt={nombrePrincipal || "Gustosito"} className="h-full w-full object-cover object-center opacity-60 lg:opacity-95" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,#946044_0%,#392318_38%,#160f0b_77%)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1b100c] via-[#1b100c]/40 to-[#1b100c]/60 lg:bg-gradient-to-r lg:from-[#21150f] lg:via-[#21150f]/95 lg:to-[#21150f]/5" />
      <div className="pointer-events-none absolute -left-28 top-1/4 h-80 w-80 rounded-full bg-[#b27b50]/10 blur-3xl" />
      <div className="relative mx-auto flex min-h-[650px] max-w-7xl flex-col justify-end px-5 pb-20 pt-28 sm:min-h-[700px] sm:px-9 sm:pb-24 lg:min-h-[760px] lg:justify-center lg:px-12 lg:pt-32">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.23em] text-[#f8dfbd] backdrop-blur-md sm:text-xs">
            <Sparkles className="h-3.5 w-3.5" /> {en ? "Freshly made, with love" : "Preparado al momento, con cariño"}
          </div>
          <h1 className="font-serif text-[clamp(3.8rem,15vw,8rem)] font-black leading-[0.88] tracking-[-0.065em]">
            {en ? <>A little <br /><span className="italic font-normal text-[#e5b581]">taste</span> of joy.</> : <>Un gustito <br /><span className="italic font-normal text-[#e5b581]">para el alma.</span></>}
          </h1>
          <p className="mt-7 max-w-md text-[15px] leading-relaxed text-[#f5e6d7]/80 sm:mt-9 sm:text-lg">
            {en ? "Hot coffee, homemade breakfasts and little moments worth savoring. Discover your next favorite." : "Cafecito caliente, desayunos hechos con cariño y pequeños momentos que merecen saborearse."}
          </p>
          <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row sm:mt-10">
            <a href="#menu" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#e7ba89] px-7 text-sm font-extrabold text-[#29180f] transition hover:bg-[#f6d2ab] active:scale-[0.98]">
              {en ? "Explore the menu" : "Descubrir el menú"}<ArrowUpRight className="h-5 w-5" />
            </a>
            <a href="#favoritos" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/35 px-7 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10">
              {en ? "See our favorites" : "Ver favoritos"}<ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
        <div className="absolute bottom-6 left-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ead4c0]/70 sm:left-9 lg:left-12">
          <Coffee className="h-4 w-4" /> GUSTOSITO · DELI & CAFÉ
        </div>
      </div>
    </section>
  );
}
