// Check if we're on the server side
const isServer = typeof window === "undefined"

// Define schema inline to avoid import issues
const schema = isServer
  ? (() => {
      const { pgTable, serial, varchar, text, integer, timestamp, date, unique } = require("drizzle-orm/pg-core")
      const { relations } = require("drizzle-orm")

      const users = pgTable("users", {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        email: varchar("email", { length: 255 }).notNull().unique(),
        password: varchar("password", { length: 255 }).notNull(),
        role: varchar("role", { length: 50 }).notNull(),
        createdAt: timestamp("created_at").defaultNow(),
      })

      const classes = pgTable("classes", {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
        teacherId: integer("teacher_id").references(() => users.id),
        createdAt: timestamp("created_at").defaultNow(),
      })

      const classStudents = pgTable(
        "class_students",
        {
          id: serial("id").primaryKey(),
          classId: integer("class_id").references(() => classes.id),
          studentId: integer("student_id").references(() => users.id),
        },
        (table) => ({
          uniqueClassStudent: unique().on(table.classId, table.studentId),
        }),
      )

      const attendance = pgTable(
        "attendance",
        {
          id: serial("id").primaryKey(),
          classId: integer("class_id").references(() => classes.id),
          studentId: integer("student_id").references(() => users.id),
          date: date("date").notNull(),
          status: varchar("status", { length: 20 }).notNull(),
          notes: text("notes"),
          createdAt: timestamp("created_at").defaultNow(),
        },
        (table) => ({
          uniqueAttendance: unique().on(table.classId, table.studentId, table.date),
        }),
      )

      return { users, classes, classStudents, attendance }
    })()
  : {}

let db: any = null

if (isServer) {
  try {
    const { neon } = require("@neondatabase/serverless")
    const { drizzle } = require("drizzle-orm/neon-http")

    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is required")
    }

    const sql = neon(connectionString)
    db = drizzle(sql, { schema })
  } catch (error) {
    console.error("Database connection error:", error)
    throw error
  }
} else {
  // Client-side placeholder
  db = {}
}

export { db, schema }
