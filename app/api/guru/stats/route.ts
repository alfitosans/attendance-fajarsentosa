import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db, schema } from "@/lib/db"
import { eq, count, and } from "drizzle-orm"

export async function GET() {
  try {
    const user = await requireAuth(["guru"])

    const [totalClasses] = await db
      .select({ count: count() })
      .from(schema.classes)
      .where(eq(schema.classes.teacherId, user.id))

    const teacherClasses = await db
      .select({ id: schema.classes.id })
      .from(schema.classes)
      .where(eq(schema.classes.teacherId, user.id))

    let totalStudents = 0
    for (const cls of teacherClasses) {
      const [studentCount] = await db
        .select({ count: count() })
        .from(schema.classStudents)
        .where(eq(schema.classStudents.classId, cls.id))
      totalStudents += studentCount.count
    }

    const today = new Date().toISOString().split("T")[0]
    let todayAttendance = 0
    for (const cls of teacherClasses) {
      const [attendanceCount] = await db
        .select({ count: count() })
        .from(schema.attendance)
        .where(
          and(
            eq(schema.attendance.classId, cls.id),
            eq(schema.attendance.date, today),
            eq(schema.attendance.status, "hadir"),
          ),
        )
      todayAttendance += attendanceCount.count
    }

    return NextResponse.json({
      totalClasses: totalClasses.count,
      totalStudents,
      todayAttendance,
    })
  } catch (error) {
    console.error("Guru stats error:", error)
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
