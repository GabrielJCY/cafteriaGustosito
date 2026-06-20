"use client";

import { motion } from "framer-motion";

export function CTA({ numeroWhatsApp }: { numeroWhatsApp: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-4 pb-10 sm:px-6"
    >
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
    </motion.section>
  );
}