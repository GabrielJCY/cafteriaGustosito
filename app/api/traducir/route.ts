import { NextResponse } from "next/server";

export const runtime = "nodejs";
const cache = new Map<string, string>();

export async function POST(request: Request) {
  try {
    const url = process.env.LIBRETRANSLATE_URL || "https://libretranslate.com";
    const apiKey = process.env.LIBRETRANSLATE_API_KEY;
    if (!apiKey && !process.env.LIBRETRANSLATE_URL) {
      return NextResponse.json({ error: "Configura LIBRETRANSLATE_API_KEY o una instancia propia LIBRETRANSLATE_URL" }, { status: 503 });
    }
    const body: unknown = await request.json();
    const textos = typeof body === "object" && body !== null && "textos" in body ? (body as { textos: unknown }).textos : null;
    if (!Array.isArray(textos) || textos.length < 1 || textos.length > 20 || !textos.every(t => typeof t === "string" && t.length > 0 && t.length <= 2000)) {
      return NextResponse.json({ error: "Se esperan entre 1 y 20 textos de máximo 2000 caracteres" }, { status: 400 });
    }
    const pendientes = [...new Set(textos as string[])].filter(t => !cache.has(t));
    if (pendientes.length) {
      const endpoint = `${url.replace(/\/$/, "")}/translate`;
      const respuesta = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: pendientes, source: "es", target: "en", format: "text", ...(apiKey ? { api_key: apiKey } : {}) }),
        signal: AbortSignal.timeout(20000), cache: "no-store",
      });
      if (!respuesta.ok) return NextResponse.json({ error: "LibreTranslate respondió con un error", status: respuesta.status }, { status: 502 });
      const data: { translatedText?: string[] | string } = await respuesta.json();
      const traducidos = data.translatedText;
      if (!Array.isArray(traducidos) || traducidos.length !== pendientes.length || !traducidos.every(t => typeof t === "string")) {
        return NextResponse.json({ error: "Formato inesperado del proveedor de traducción" }, { status: 502 });
      }
      pendientes.forEach((t, i) => cache.set(t, traducidos[i]));
      if (cache.size > 3000) cache.clear();
    }
    return NextResponse.json({ traducciones: (textos as string[]).map(t => cache.get(t) ?? t) });
  } catch {
    return NextResponse.json({ error: "No se pudo completar la traducción" }, { status: 502 });
  }
}
