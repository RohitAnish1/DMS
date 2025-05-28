"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PatientProfileForm } from "@/components/patient-profile-form"
import { PatientDashboardLayout } from "@/components/patient-dashboard-layout"
import { apiService } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

interface PatientProfile {
  id: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  profilePhoto?: string
}

export default function PatientProfilePage() {
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const result = await apiService.getPatientProfile()
      if (result.success) {
        setProfile(result.data)
      } else {
        setError(result.message || "Failed to load profile")
      }
    } catch (err) {
      setError("Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = async (data: Omit<PatientProfile, "id">) => {
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await apiService.updatePatientProfile(data)
      if (result.success) {
        setProfile({ ...profile!, ...result.data })
        setSuccess("Profile updated successfully!")
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.message || "Failed to update profile")
      }
    } catch (err) {
      setError("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <PatientDashboardLayout>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PatientDashboardLayout>
    )
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            {profile && (
              <PatientProfileForm initialData={profile} onSubmit={handleProfileUpdate} isLoading={isSaving} />
            )}
          </CardContent>
        </Card>
      </div>
    </PatientDashboardLayout>
  )
}
