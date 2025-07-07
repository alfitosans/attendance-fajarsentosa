"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, CheckCircle } from "lucide-react"
import { DashboardLayout } from "./dashboard-layout"

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface Class {
  id: number
  name: string
  description: string
  studentCount: number
}

interface GuruDashboardProps {
  user: User
}

export function GuruDashboard({ user }: GuruDashboardProps) {
  const [classes, setClasses] = useState<Class[]>([])
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    todayAttendance: 0,
  })

  useEffect(() => {
    fetchClasses()
    fetchStats()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/guru/classes")
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/guru/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Guru</h1>
          <p className="text-gray-600">Selamat datang, {user.name}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kelas Saya</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClasses}</div>
              <p className="text-xs text-muted-foreground">Kelas yang diampu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Siswa di semua kelas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absensi Hari Ini</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayAttendance}</div>
              <p className="text-xs text-muted-foreground">Siswa hadir hari ini</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kelas yang Diampu</CardTitle>
            <CardDescription>Daftar kelas yang Anda ajar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{cls.name}</h3>
                    <p className="text-sm text-gray-600">{cls.description}</p>
                    <p className="text-sm text-gray-500">{cls.studentCount} siswa</p>
                  </div>
                  <div className="space-x-2">
                    <Button size="sm">Input Absensi</Button>
                    <Button size="sm" variant="outline">
                      Lihat Laporan
                    </Button>
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
