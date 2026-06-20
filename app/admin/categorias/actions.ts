"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function crearSlug(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validarCategoria(formData: FormData) {
  const nombre = String(formData.get("nombre") || "").trim();
  const descripcion = String(formData.get("descripcion") || "").trim();
  const orden = Number(formData.get("orden") || 0);

  if (!nombre) {
    throw new Error("El nombre de la categoría es obligatorio.");
  }

  return {
    nombre,
    descripcion,
    orden,
  };
}

function urlExito(mensaje: string) {
  return `/admin/categorias?success=${encodeURIComponent(mensaje)}`;
}

function urlError(mensaje: string) {
  return `/admin/categorias?error=${encodeURIComponent(mensaje)}`;
}

export async function crearCategoria(formData: FormData) {
  let redirectUrl = "/admin/categorias";

  try {
    const { nombre, descripcion, orden } = validarCategoria(formData);

    const slug = `${crearSlug(nombre)}-${Date.now()}`;

    await db.execute({
      sql: `
        INSERT INTO categorias (
          nombre,
          slug,
          descripcion,
          orden,
          activo
        )
        VALUES (?, ?, ?, ?, 1)
      `,
      args: [nombre, slug, descripcion || null, orden],
    });

    revalidatePath("/admin/categorias");
    revalidatePath("/admin/productos");

    redirectUrl = urlExito("Categoría creada correctamente.");
  } catch (error) {
    console.error("Error creando categoría:", error);
    redirectUrl = urlError("No se pudo crear la categoría.");
  }

  redirect(redirectUrl);
}

export async function actualizarCategoria(formData: FormData) {
  let redirectUrl = "/admin/categorias";

  try {
    const id = Number(formData.get("id"));

    if (!id) {
      throw new Error("ID de categoría inválido.");
    }

    const { nombre, descripcion, orden } = validarCategoria(formData);

    const slug = `${crearSlug(nombre)}-${id}`;

    await db.execute({
      sql: `
        UPDATE categorias
        SET
          nombre = ?,
          slug = ?,
          descripcion = ?,
          orden = ?
        WHERE id = ?
      `,
      args: [nombre, slug, descripcion || null, orden, id],
    });

    revalidatePath("/admin/categorias");
    revalidatePath("/admin/productos");

    redirectUrl = urlExito("Categoría actualizada correctamente.");
  } catch (error) {
    console.error("Error actualizando categoría:", error);
    redirectUrl = urlError("No se pudo actualizar la categoría.");
  }

  redirect(redirectUrl);
}

export async function eliminarCategoria(formData: FormData) {
  let redirectUrl = "/admin/categorias";

  try {
    const id = Number(formData.get("id"));

    if (!id) {
      throw new Error("ID de categoría inválido.");
    }

    await db.execute({
      sql: `
        UPDATE categorias
        SET activo = 0
        WHERE id = ?
      `,
      args: [id],
    });

    revalidatePath("/admin/categorias");
    revalidatePath("/admin/productos");

    redirectUrl = urlExito("Categoría eliminada correctamente.");
  } catch (error) {
    console.error("Error eliminando categoría:", error);
    redirectUrl = urlError("No se pudo eliminar la categoría.");
  }

  redirect(redirectUrl);
}