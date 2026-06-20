export function Footer() {
  return (
    <footer className="border-t border-cafe-200 bg-white px-4 py-6 text-center sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold text-cafe-500">
          © {new Date().getFullYear()} Gustosito — Desayunos, café y buenos momentos.
        </p>
        <div className="mt-2 flex justify-center gap-4 text-xs text-cafe-400">
          <span>Hecho con ❤️</span>
          <span>•</span>
          <span>Bolivia</span>
        </div>
      </div>
    </footer>
  );
}