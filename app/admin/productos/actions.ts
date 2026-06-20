"use server";

import { db } from "@/lib/db";
import { cloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { UploadApiResponse } from "cloudinary";

export type Categoria = {
  id: number;
  nombre: string;
  slug: string;
};

export type Producto = {
  id: number;
  categoria_id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  imagen_url: string | null;
  destacado: number;
  disponible: number;
  categoria: string;
  categoria_slug: string;
};

function crearSlug(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function obtenerPrecio(valor: FormDataEntryValue | null) {
  const texto = String(valor || "").replace(",", ".").trim();
  return Number(texto);
}

async function subirImagenACloudinary(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "kiosko-cafe/productos",
        resource_type: "image",
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary no devolvió una URL segura."));
          return;
        }

        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}

function validarProducto(formData: FormData) {
  const categoriaId = Number(formData.get("categoria_id"));
  const nombre = String(formData.get("nombre") || "").trim();
  const descripcion = String(formData.get("descripcion") || "").trim();
  const precio = obtenerPrecio(formData.get("precio"));
  const destacado = formData.get("destacado") === "on" ? 1 : 0;
  const disponible = formData.get("disponible") === "on" ? 1 : 0;

  if (!categoriaId) {
    throw new Error("Debes seleccionar una categoría.");
  }

  if (!nombre) {
    throw new Error("El nombre del producto es obligatorio.");
  }

  if (!descripcion) {
    throw new Error("La descripción del producto es obligatoria.");
  }

  if (!precio || precio <= 0) {
    throw new Error("El precio debe ser mayor a 0.");
  }

  return {
    categoriaId,
    nombre,
    descripcion,
    precio,
    destacado,
    disponible,
  };
}

/* =========================
   READ: Obtener categorías
========================= */

export async function obtenerCategorias(): Promise<Categoria[]> {
  const result = await db.execute(`
    SELECT id, nombre, slug
    FROM categorias
    WHERE activo = 1
    ORDER BY orden ASC, nombre ASC
  `);

  return result.rows.map((row) => ({
    id: Number(row.id),
    nombre: String(row.nombre),
    slug: String(row.slug),
  }));
}

/* =========================
   READ: Obtener productos
========================= */

export async function obtenerProductos(
  categoriaSlug: string = "todos"
): Promise<Producto[]> {
  if (categoriaSlug && categoriaSlug !== "todos") {
    const result = await db.execute({
      sql: `
        SELECT 
          p.id,
          p.categoria_id,
          p.nombre,
          p.slug,
          p.descripcion,
          p.precio,
          p.imagen_url,
          p.destacado,
          p.disponible,
          c.nombre AS categoria,
          c.slug AS categoria_slug
        FROM productos p
        INNER JOIN categorias c ON c.id = p.categoria_id
        WHERE c.slug = ?
        ORDER BY p.created_at DESC
      `,
      args: [categoriaSlug],
    });

    return result.rows.map((row) => ({
      id: Number(row.id),
      categoria_id: Number(row.categoria_id),
      nombre: String(row.nombre),
      slug: String(row.slug),
      descripcion: String(row.descripcion),
      precio: Number(row.precio),
      imagen_url: row.imagen_url ? String(row.imagen_url) : null,
      destacado: Number(row.destacado),
      disponible: Number(row.disponible),
      categoria: String(row.categoria),
      categoria_slug: String(row.categoria_slug),
    }));
  }

  const result = await db.execute(`
    SELECT 
      p.id,
      p.categoria_id,
      p.nombre,
      p.slug,
      p.descripcion,
      p.precio,
      p.imagen_url,
      p.destacado,
      p.disponible,
      c.nombre AS categoria,
      c.slug AS categoria_slug
    FROM productos p
    INNER JOIN categorias c ON c.id = p.categoria_id
    ORDER BY p.created_at DESC
  `);

  return result.rows.map((row) => ({
    id: Number(row.id),
    categoria_id: Number(row.categoria_id),
    nombre: String(row.nombre),
    slug: String(row.slug),
    descripcion: String(row.descripcion),
    precio: Number(row.precio),
    imagen_url: row.imagen_url ? String(row.imagen_url) : null,
    destacado: Number(row.destacado),
    disponible: Number(row.disponible),
    categoria: String(row.categoria),
    categoria_slug: String(row.categoria_slug),
  }));
}

/* =========================
   READ: Obtener producto por ID
========================= */

export async function obtenerProductoPorId(id: number): Promise<Producto | null> {
  const result = await db.execute({
    sql: `
      SELECT 
        p.id,
        p.categoria_id,
        p.nombre,
        p.slug,
        p.descripcion,
        p.precio,
        p.imagen_url,
        p.destacado,
        p.disponible,
        c.nombre AS categoria,
        c.slug AS categoria_slug
      FROM productos p
      INNER JOIN categorias c ON c.id = p.categoria_id
      WHERE p.id = ?
      LIMIT 1
    `,
    args: [id],
  });

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    categoria_id: Number(row.categoria_id),
    nombre: String(row.nombre),
    slug: String(row.slug),
    descripcion: String(row.descripcion),
    precio: Number(row.precio),
    imagen_url: row.imagen_url ? String(row.imagen_url) : null,
    destacado: Number(row.destacado),
    disponible: Number(row.disponible),
    categoria: String(row.categoria),
    categoria_slug: String(row.categoria_slug),
  };
}

/* =========================
   CREATE: Crear producto con imagen
========================= */

export async function crearProducto(formData: FormData) {
  const {
    categoriaId,
    nombre,
    descripcion,
    precio,
    destacado,
    disponible,
  } = validarProducto(formData);

  const imagen = formData.get("imagen");

  if (!(imagen instanceof File) || imagen.size === 0) {
    throw new Error("Debes seleccionar una imagen del producto.");
  }

  if (!imagen.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen.");
  }

  const imagenUrl = await subirImagenACloudinary(imagen);

  const slug = `${crearSlug(nombre)}-${Date.now()}`;

  await db.execute({
    sql: `
      INSERT INTO productos (
        categoria_id,
        nombre,
        slug,
        descripcion,
        precio,
        imagen_url,
        destacado,
        disponible
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      categoriaId,
      nombre,
      slug,
      descripcion,
      precio,
      imagenUrl,
      destacado,
      disponible,
    ],
  });

  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

/* =========================
   UPDATE: Actualizar producto
========================= */

export async function actualizarProducto(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!id) {
    throw new Error("ID de producto inválido.");
  }

  const {
    categoriaId,
    nombre,
    descripcion,
    precio,
    destacado,
    disponible,
  } = validarProducto(formData);

  const imagen = formData.get("imagen");
  const imagenActual = String(formData.get("imagen_actual") || "").trim();

  let imagenUrl = imagenActual || null;

  if (imagen instanceof File && imagen.size > 0) {
    if (!imagen.type.startsWith("image/")) {
      throw new Error("El archivo debe ser una imagen.");
    }

    imagenUrl = await subirImagenACloudinary(imagen);
  }

  const slug = `${crearSlug(nombre)}-${id}`;

  await db.execute({
    sql: `
      UPDATE productos
      SET
        categoria_id = ?,
        nombre = ?,
        slug = ?,
        descripcion = ?,
        precio = ?,
        imagen_url = ?,
        destacado = ?,
        disponible = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      categoriaId,
      nombre,
      slug,
      descripcion,
      precio,
      imagenUrl,
      destacado,
      disponible,
      id,
    ],
  });

  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}/editar`);

  redirect("/admin/productos");
}

/* =========================
   DELETE: Eliminar producto
========================= */

export async function eliminarProducto(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!id) {
    throw new Error("ID de producto inválido.");
  }

  await db.execute({
    sql: `
      DELETE FROM productos
      WHERE id = ?
    `,
    args: [id],
  });

  revalidatePath("/admin/productos");
}

/* =========================
   EXTRA: Cambiar disponibilidad
========================= */

export async function cambiarDisponibilidadProducto(formData: FormData) {
  const id = Number(formData.get("id"));
  const disponible = Number(formData.get("disponible"));

  if (!id) {
    throw new Error("ID de producto inválido.");
  }

  await db.execute({
    sql: `
      UPDATE productos
      SET 
        disponible = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [disponible === 1 ? 0 : 1, id],
  });

  revalidatePath("/admin/productos");
}