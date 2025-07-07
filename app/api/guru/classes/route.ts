import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db, schema } from "@/lib/db"
import { eq, count } from "drizzle-orm"

export async function GET() {
  try {
    const user = await requireAuth(["guru"])

    const teacherClasses = await db
      .select({
        id: schema.classes.id,
        name: schema.classes.name,
        description: schema.classes.description,
      })
      .from(schema.classes)
      .where(eq(schema.classes.teacherId, user.id))

    const classesWithStudentCount = await Promise.all(
      teacherClasses.map(async (cls) => {
        const [studentCount] = await db
          .select({ count: count() })
          .from(schema.classStudents)
          .where(eq(schema.classStudents.classId, cls.id))

        return {
          ...cls,
          studentCount: studentCount.count,
        }
      }),
    )

    return NextResponse.json(classesWithStudentCount)
  } catch (error) {
    console.error("Guru classes error:", error)
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
