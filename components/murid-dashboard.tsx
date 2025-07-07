"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, CheckCircle, XCircle } from "lucide-react"
import { DashboardLayout } from "./dashboard-layout"

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface AttendanceRecord {
  id: number
  className: string
  date: string
  status: string
  notes?: string
}

interface MuridDashboardProps {
  user: User
}

export function MuridDashboard({ user }: MuridDashboardProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState({
    totalClasses: 0,
    attendanceRate: 0,
    thisMonthAttendance: 0,
  })

  useEffect(() => {
    fetchAttendanceRecords()
    fetchStats()
  }, [])

  const fetchAttendanceRecords = async () => {
    try {
      const response = await fetch("/api/murid/attendance")
      const data = await response.json()
      setAttendanceRecords(data)
    } catch (error) {
      console.error("Error fetching attendance:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/murid/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "hadir":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "tidak_hadir":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "izin":
        return <Calendar className="h-4 w-4 text-yellow-500" />
      case "sakit":
        return <Calendar className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "hadir":
        return "Hadir"
      case "tidak_hadir":
        return "Tidak Hadir"
      case "izin":
        return "Izin"
      case "sakit":
        return "Sakit"
      default:
        return status
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Siswa</h1>
          <p className="text-gray-600">Selamat datang, {user.name}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kelas Diikuti</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClasses}</div>
              <p className="text-xs text-muted-foreground">Kelas aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tingkat Kehadiran</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">Keseluruhan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisMonthAttendance}</div>
              <p className="text-xs text-muted-foreground">Hari hadir</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Absensi</CardTitle>
            <CardDescription>Riwayat kehadiran Anda di semua kelas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(record.status)}
                    <div>
                      <h3 className="font-semibold">{record.className}</h3>
                      <p className="text-sm text-gray-600">{record.date}</p>
                      {record.notes && <p className="text-sm text-gray-500">{record.notes}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === "hadir"
                          ? "bg-green-100 text-green-800"
                          : record.status === "tidak_hadir"
                            ? "bg-red-100 text-red-800"
                            : record.status === "izin"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {getStatusText(record.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
