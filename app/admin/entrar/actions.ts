"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function entrarAdmin(formData: FormData) {
  const clave = String(formData.get("clave") || "").trim();

  const adminSecret = process.env.ADMIN_SECRET;
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;

  if (!adminSecret) {
    redirect("/admin/entrar?error=Falta configurar ADMIN_SECRET");
  }

  if (!sessionToken) {
    redirect("/admin/entrar?error=Falta configurar ADMIN_SESSION_TOKEN");
  }

  if (clave !== adminSecret) {
    redirect("/admin/entrar?error=Clave incorrecta");
  }

  const cookieStore = await cookies();

  cookieStore.set("gustosito_admin", sessionToken!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/admin/dashboard");
}

export async function salirAdmin() {
  const cookieStore = await cookies();

  cookieStore.delete("gustosito_admin");

  redirect("/admin/entrar");
}