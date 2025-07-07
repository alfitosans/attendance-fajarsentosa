import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db, schema } from "@/lib/db"
import { eq, desc } from "drizzle-orm"

export async function GET() {
  try {
    const user = await requireAuth(["murid"])

    const attendanceRecords = await db
      .select({
        id: schema.attendance.id,
        date: schema.attendance.date,
        status: schema.attendance.status,
        notes: schema.attendance.notes,
        className: schema.classes.name,
      })
      .from(schema.attendance)
      .innerJoin(schema.classes, eq(schema.attendance.classId, schema.classes.id))
      .where(eq(schema.attendance.studentId, user.id))
      .orderBy(desc(schema.attendance.date))
      .limit(10)

    return NextResponse.json(attendanceRecords)
  } catch (error) {
    console.error("Murid attendance error:", error)
    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json({ error: "Login diperlukan" }, { status: 401 })
      }
      if (error.message === "Insufficient permissions") {
        return NextResponse.json({ error: "Akses ditolak" }, { status: 403 })
      }
    }
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
