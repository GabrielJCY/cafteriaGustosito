import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db.execute("SELECT datetime('now') AS fecha_actual;");

    return NextResponse.json({
      ok: true,
      message: "Conexión exitosa con Turso SQLite",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error conectando con Turso:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error conectando con Turso",
      },
      { status: 500 }
    );
  }
}