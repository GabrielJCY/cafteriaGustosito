import Link from "next/link";

export default function PedidosPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] px-6 py-8 text-neutral-950">
      <div className="mx-auto max-w-5xl">
        <Link
          href="./dashboard"
          className="text-sm font-bold text-[#6F4E37] hover:underline"
        >
          ← Volver al dashboard
        </Link>

        <header className="mt-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#6F4E37]">
            Mini sistema
          </p>

          <h1 className="mt-2 text-4xl font-black">Pedidos</h1>

          <p className="mt-3 text-neutral-600">
            Aquí veremos los pedidos que se guarden desde WhatsApp.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
          <p className="font-semibold text-neutral-700">
            Esta sección la haremos después de productos.
          </p>
        </section>
      </div>
    </main>
  );
}