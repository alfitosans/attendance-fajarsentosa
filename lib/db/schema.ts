import { pgTable, serial, varchar, text, integer, timestamp, date, unique } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  teacherId: integer("teacher_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
})

export const classStudents = pgTable(
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

export const attendance = pgTable(
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  teachingClasses: many(classes),
  studentClasses: many(classStudents),
  attendanceRecords: many(attendance),
}))

export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(users, {
    fields: [classes.teacherId],
    references: [users.id],
  }),
  students: many(classStudents),
  attendanceRecords: many(attendance),
}))

export const classStudentsRelations = relations(classStudents, ({ one }) => ({
  class: one(classes, {
    fields: [classStudents.classId],
    references: [classes.id],
  }),
  student: one(users, {
    fields: [classStudents.studentId],
    references: [users.id],
  }),
}))

export const attendanceRelations = relations(attendance, ({ one }) => ({
  class: one(classes, {
    fields: [attendance.classId],
    references: [classes.id],
  }),
  student: one(users, {
    fields: [attendance.studentId],
    references: [users.id],
  }),
}))

// Explicit exports for better compatibility
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Class = typeof classes.$inferSelect
export type NewClass = typeof classes.$inferInsert
export type ClassStudent = typeof classStudents.$inferSelect
export type NewClassStudent = typeof classStudents.$inferInsert
export type Attendance = typeof attendance.$inferSelect
export type NewAttendance = typeof attendance.$inferInsert
