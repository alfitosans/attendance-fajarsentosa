import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db, schema } from "@/lib/db"
import { eq, count } from "drizzle-orm"

export async function GET() {
  try {
    await requireAuth(["admin"])

    const [totalUsers] = await db.select({ count: count() }).from(schema.users)
    const [totalClasses] = await db.select({ count: count() }).from(schema.classes)
    const [totalAttendance] = await db.select({ count: count() }).from(schema.attendance)

    const today = new Date().toISOString().split("T")[0]
    const [todayAttendance] = await db
      .select({ count: count() })
      .from(schema.attendance)
      .where(eq(schema.attendance.date, today))

    return NextResponse.json({
      totalUsers: totalUsers.count,
      totalClasses: totalClasses.count,
      totalAttendance: totalAttendance.count,
      todayAttendance: todayAttendance.count,
    })
  } catch (error) {
    console.error("Admin stats error:", error)
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
