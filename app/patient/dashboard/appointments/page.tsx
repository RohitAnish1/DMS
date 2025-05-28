"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AppointmentsList } from "@/components/appointments-list"
import { PatientDashboardLayout } from "@/components/patient-dashboard-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { apiService } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { BookAppointmentDialog } from "@/components/book-appointment-dialog"

interface Appointment {
  id: string
  doctorName: string
  doctorSpecialization: string
  locationName: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
  reason: string
  notes?: string
}

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showBookDialog, setShowBookDialog] = useState(false)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const result = await apiService.getPatientAppointments()
      if (result.success) {
        setAppointments(result.data)
      } else {
        setError(result.message || "Failed to load appointments")
      }
    } catch (err) {
      setError("Failed to load appointments")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const result = await apiService.cancelAppointment(appointmentId)
      if (result.success) {
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "cancelled" as const } : apt)),
        )
      } else {
        setError(result.message || "Failed to cancel appointment")
      }
    } catch (err) {
      setError("Failed to cancel appointment")
    }
  }

  const handleRescheduleAppointment = async (appointmentId: string, date: string, time: string) => {
    try {
      const result = await apiService.rescheduleAppointment(appointmentId, { date, time })
      if (result.success) {
        setAppointments((prev) => prev.map((apt) => (apt.id === appointmentId ? { ...apt, date, time } : apt)))
      } else {
        setError(result.message || "Failed to reschedule appointment")
      }
    } catch (err) {
      setError("Failed to reschedule appointment")
    }
  }

  const handleBookAppointment = () => {
    loadAppointments() // Refresh the list after booking
    setShowBookDialog(false)
  }

  if (isLoading) {
    return (
      <PatientDashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PatientDashboardLayout>
    )
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600">View and manage your healthcare appointments</p>
          </div>
          <Button onClick={() => setShowBookDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <AppointmentsList
          appointments={appointments}
          onCancel={handleCancelAppointment}
          onReschedule={handleRescheduleAppointment}
        />

        <BookAppointmentDialog
          open={showBookDialog}
          onOpenChange={setShowBookDialog}
          onSuccess={handleBookAppointment}
        />
      </div>
    </PatientDashboardLayout>
  )
}
