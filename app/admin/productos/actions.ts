
"use server";

import { db } from "@/lib/db";
import { cloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { UploadApiResponse } from "cloudinary";

/* =========================================
   TIPOS
========================================= */

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

/* =========================================
   UTILIDADES
========================================= */

function crearSlug(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function obtenerPrecio(valor: FormDataEntryValue | null) {
  const texto = String(valor ?? "")
    .replace(",", ".")
    .trim();

  if (!texto) return NaN;

  return Number(texto);
}

function validarId(id: number) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("ID de producto inválido.");
  }
}

function registrarError(
  operacion: string,
  error: unknown
) {
  console.error(
    `[PRODUCTOS] Error en ${operacion}:`,
    error
  );
}

function convertirProducto(
  row: Record<string, unknown>
): Producto {
  return {
    id: Number(row.id),
    categoria_id: Number(row.categoria_id),
    nombre: String(row.nombre),
    slug: String(row.slug),
    descripcion: String(row.descripcion),
    precio: Number(row.precio),
    imagen_url: row.imagen_url
      ? String(row.imagen_url)
      : null,
    destacado: Number(row.destacado),
    disponible: Number(row.disponible),
    categoria: String(row.categoria),
    categoria_slug: String(row.categoria_slug),
  };
}

/* =========================================
   VALIDAR PRODUCTO
========================================= */

function validarProducto(formData: FormData) {
  const categoriaId = Number(
    formData.get("categoria_id")
  );

  const nombre = String(
    formData.get("nombre") || ""
  ).trim();

  const descripcion = String(
    formData.get("descripcion") || ""
  ).trim();

  const precio = obtenerPrecio(
    formData.get("precio")
  );

  const destacado =
    formData.get("destacado") === "on" ? 1 : 0;

  const disponible =
    formData.get("disponible") === "on" ? 1 : 0;

  if (
    !Number.isSafeInteger(categoriaId) ||
    categoriaId <= 0
  ) {
    throw new Error(
      "Debes seleccionar una categoría válida."
    );
  }

  if (!nombre) {
    throw new Error(
      "El nombre del producto es obligatorio."
    );
  }

  if (!descripcion) {
    throw new Error(
      "La descripción del producto es obligatoria."
    );
  }

  if (!Number.isFinite(precio) || precio <= 0) {
    throw new Error(
      "El precio debe ser mayor a 0."
    );
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

/* =========================================
   CLOUDINARY
========================================= */

async function subirImagenACloudinary(
  file: File
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error(
      "El archivo seleccionado no es una imagen."
    );
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      "La imagen no debe superar los 5 MB."
    );
  }

  console.log(
    "[CLOUDINARY] Iniciando subida:",
    file.name,
    "Tamaño:",
    file.size
  );

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imagenUrl = await new Promise<string>(
      (resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder: "kiosko-cafe/productos",
              resource_type: "image",
              timeout: 60000,
            },
            (
              error,
              result:
                | UploadApiResponse
                | undefined
            ) => {
              if (error) {
                reject(error);
                return;
              }

              if (!result?.secure_url) {
                reject(
                  new Error(
                    "Cloudinary no devolvió una URL segura."
                  )
                );
                return;
              }

              resolve(result.secure_url);
            }
          );

        uploadStream.on("error", reject);
        uploadStream.end(buffer);
      }
    );

    console.log(
      "[CLOUDINARY] Imagen subida correctamente."
    );

    return imagenUrl;
  } catch (error) {
    registrarError("Cloudinary", error);
    throw error;
  }
}

/* =========================================
   READ: OBTENER CATEGORÍAS
========================================= */

export async function obtenerCategorias(): Promise<
  Categoria[]
> {
  console.log(
    "[CATEGORIAS] Consultando categorías..."
  );

  try {
    const result = await db.execute(`
      SELECT id, nombre, slug
      FROM categorias
      WHERE activo = 1
      ORDER BY orden ASC, nombre ASC
    `);

    console.log(
      "[CATEGORIAS] Registros:",
      result.rows.length
    );

    return result.rows.map((row) => ({
      id: Number(row.id),
      nombre: String(row.nombre),
      slug: String(row.slug),
    }));
  } catch (error) {
    registrarError(
      "obtenerCategorias / Turso",
      error
    );

    throw error;
  }
}

/* =========================================
   READ: OBTENER PRODUCTOS
========================================= */

export async function obtenerProductos(
  categoriaSlug: string = "todos"
): Promise<Producto[]> {
  console.log(
    "[PRODUCTOS] Consultando lista:",
    categoriaSlug
  );

  try {
    if (
      categoriaSlug &&
      categoriaSlug !== "todos"
    ) {
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
          INNER JOIN categorias c
            ON c.id = p.categoria_id
          WHERE c.slug = ?
          ORDER BY p.created_at DESC
        `,
        args: [categoriaSlug],
      });

      return result.rows.map((row) =>
        convertirProducto(row)
      );
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
      INNER JOIN categorias c
        ON c.id = p.categoria_id
      ORDER BY p.created_at DESC
    `);

    return result.rows.map((row) =>
      convertirProducto(row)
    );
  } catch (error) {
    registrarError(
      "obtenerProductos / Turso",
      error
    );

    throw error;
  }
}

/* =========================================
   READ: OBTENER PRODUCTO POR ID
========================================= */

export async function obtenerProductoPorId(
  id: number
): Promise<Producto | null> {
  validarId(id);

  console.log(
    "[PRODUCTOS] Buscando producto:",
    id
  );

  try {
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
        INNER JOIN categorias c
          ON c.id = p.categoria_id
        WHERE p.id = ?
        LIMIT 1
      `,
      args: [id],
    });

    const row = result.rows[0];

    if (!row) {
      console.warn(
        "[PRODUCTOS] Producto no encontrado:",
        id
      );

      return null;
    }

    console.log(
      "[PRODUCTOS] Producto encontrado:",
      id
    );

    return convertirProducto(row);
  } catch (error) {
    registrarError(
      "obtenerProductoPorId / Turso",
      error
    );

    throw error;
  }
}

/* =========================================
   CREATE: CREAR PRODUCTO
========================================= */

export async function crearProducto(
  formData: FormData
) {
  console.log(
    "[PRODUCTOS] Iniciando creación..."
  );

  const {
    categoriaId,
    nombre,
    descripcion,
    precio,
    destacado,
    disponible,
  } = validarProducto(formData);

  const imagen = formData.get("imagen");

  if (
    !(imagen instanceof File) ||
    imagen.size === 0
  ) {
    throw new Error(
      "Debes seleccionar una imagen del producto."
    );
  }

  try {
    const imagenUrl =
      await subirImagenACloudinary(imagen);

    const slug = `${crearSlug(nombre)}-${Date.now()}`;

    console.log(
      "[PRODUCTOS] Guardando en Turso..."
    );

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

    console.log(
      "[PRODUCTOS] Producto creado correctamente."
    );
  } catch (error) {
    registrarError(
      "crearProducto",
      error
    );

    throw error;
  }

  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

/* =========================================
   UPDATE: ACTUALIZAR PRODUCTO
========================================= */

export async function actualizarProducto(
  formData: FormData
) {
  const id = Number(formData.get("id"));

  validarId(id);

  console.log(
    "[PRODUCTOS] Iniciando actualización:",
    id
  );

  const {
    categoriaId,
    nombre,
    descripcion,
    precio,
    destacado,
    disponible,
  } = validarProducto(formData);

  const imagen = formData.get("imagen");

  try {
    /*
      Obtener la imagen actual directamente
      desde la base de datos.
    */

    console.log(
      "[PRODUCTOS] Consultando imagen actual..."
    );

    const consultaActual = await db.execute({
      sql: `
        SELECT imagen_url
        FROM productos
        WHERE id = ?
        LIMIT 1
      `,
      args: [id],
    });

    const productoActual =
      consultaActual.rows[0];

    if (!productoActual) {
      throw new Error(
        "El producto que intentas editar no existe."
      );
    }

    let imagenUrl: string | null =
      productoActual.imagen_url
        ? String(productoActual.imagen_url)
        : null;

    /*
      Si existe una imagen nueva,
      subirla a Cloudinary.
      En caso contrario, conservar
      la imagen actual.
    */

    if (
      imagen instanceof File &&
      imagen.size > 0
    ) {
      console.log(
        "[PRODUCTOS] Se detectó una nueva imagen."
      );

      imagenUrl =
        await subirImagenACloudinary(imagen);
    } else {
      console.log(
        "[PRODUCTOS] Conservando imagen actual."
      );
    }

    const slug = `${crearSlug(nombre)}-${id}`;

    console.log(
      "[PRODUCTOS] Ejecutando UPDATE en Turso..."
    );

    const resultado = await db.execute({
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

    if (resultado.rowsAffected === 0) {
      throw new Error(
        "No se pudo actualizar el producto."
      );
    }

    console.log(
      "[PRODUCTOS] Actualización exitosa:",
      id
    );
  } catch (error) {
    registrarError(
      "actualizarProducto",
      error
    );

    throw error;
  }

  /*
    Revalidar después de actualizar.
  */

  revalidatePath("/admin/productos");

  revalidatePath(
    `/admin/productos/editar/${id}`
  );

  /*
    Redirección fuera del try/catch
    para no capturar NEXT_REDIRECT.
  */

  redirect("/admin/productos");
}

/* =========================================
   DELETE: ELIMINAR PRODUCTO
========================================= */

export async function eliminarProducto(
  formData: FormData
) {
  const id = Number(formData.get("id"));

  validarId(id);

  console.log(
    "[PRODUCTOS] Eliminando producto:",
    id
  );

  try {
    await db.execute({
      sql: `
        DELETE FROM productos
        WHERE id = ?
      `,
      args: [id],
    });

    console.log(
      "[PRODUCTOS] Producto eliminado:",
      id
    );
  } catch (error) {
    registrarError(
      "eliminarProducto / Turso",
      error
    );

    throw error;
  }

  revalidatePath("/admin/productos");
}

/* =========================================
   EXTRA: CAMBIAR DISPONIBILIDAD
========================================= */

export async function cambiarDisponibilidadProducto(
  formData: FormData
) {
  const id = Number(formData.get("id"));

  validarId(id);

  const disponible = Number(
    formData.get("disponible")
  );

  if (
    disponible !== 0 &&
    disponible !== 1
  ) {
    throw new Error(
      "Valor de disponibilidad inválido."
    );
  }

  console.log(
    "[PRODUCTOS] Cambiando disponibilidad:",
    id
  );

  try {
    await db.execute({
      sql: `
        UPDATE productos
        SET
          disponible = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        disponible === 1 ? 0 : 1,
        id,
      ],
    });

    console.log(
      "[PRODUCTOS] Disponibilidad actualizada."
    );
  } catch (error) {
    registrarError(
      "cambiarDisponibilidadProducto / Turso",
      error
    );

    throw error;
  }

  revalidatePath("/admin/productos");
}
