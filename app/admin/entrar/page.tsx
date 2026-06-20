import Link from "next/link";
import { entrarAdmin } from "./actions";
import { PasswordInput } from "@/components/ui/password-input";

type EntrarAdminPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function EntrarAdminPage({
  searchParams,
}: EntrarAdminPageProps) {
  const params = await searchParams;
  const error = params?.error || "";

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-4 py-8 text-neutral-950">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
        <section className="w-full rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#6F4E37]/10 text-4xl">
              ☕
            </div>

            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#6F4E37]">
              Cafetería Gustosito
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Acceso administrativo
            </h1>

            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Ingresa la clave del negocio para administrar categorías,
              productos y pedidos.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form action={entrarAdmin} className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-neutral-700">
                Clave de administrador
              </label>

              <PasswordInput />
            </div>

            <button
              type="submit"
              className="min-h-12 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:bg-[#6F4E37]"
            >
              Entrar al panel
            </button>

            <Link
              href="/"
              className="flex min-h-12 items-center justify-center rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-bold text-neutral-700 transition hover:border-[#6F4E37] hover:text-[#6F4E37]"
            >
              Volver a la página pública
            </Link>
          </form>
        </section>
      </div>
    </main>
  );
}