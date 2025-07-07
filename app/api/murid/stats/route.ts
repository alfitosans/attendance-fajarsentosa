import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db, schema } from "@/lib/db"
import { eq, count, and, gte } from "drizzle-orm"

export async function GET() {
  try {
    const user = await requireAuth(["murid"])

    const [totalClasses] = await db
      .select({ count: count() })
      .from(schema.classStudents)
      .where(eq(schema.classStudents.studentId, user.id))

    const [totalAttendance] = await db
      .select({ count: count() })
      .from(schema.attendance)
      .where(eq(schema.attendance.studentId, user.id))

    const [presentAttendance] = await db
      .select({ count: count() })
      .from(schema.attendance)
      .where(and(eq(schema.attendance.studentId, user.id), eq(schema.attendance.status, "hadir")))

    const attendanceRate =
      totalAttendance.count > 0 ? Math.round((presentAttendance.count / totalAttendance.count) * 100) : 0

    const thisMonth = new Date()
    thisMonth.setDate(1)
    const [thisMonthAttendance] = await db
      .select({ count: count() })
      .from(schema.attendance)
      .where(
        and(
          eq(schema.attendance.studentId, user.id),
          eq(schema.attendance.status, "hadir"),
          gte(schema.attendance.date, thisMonth.toISOString().split("T")[0]),
        ),
      )

    return NextResponse.json({
      totalClasses: totalClasses.count,
      attendanceRate,
      thisMonthAttendance: thisMonthAttendance.count,
    })
  } catch (error) {
    console.error("Murid stats error:", error)
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
