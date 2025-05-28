"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit, User, MapPin, Clock, Calendar, Phone, Mail, Building, Award } from "lucide-react"

interface OnboardingData {
  registration: {
    email: string
    password: string
    fullName: string
    phone: string
    medicalRegistrationNumber: string
  }
  profile: {
    specialization: string
    yearsOfExperience: number
    clinicName: string
    address: string
    profilePhoto?: File
  }
  locations: Array<{
    id?: string
    name: string
    address: string
    phone: string
    weeklySchedule: Array<{
      day: string
      startTime: string
      endTime: string
      isAvailable: boolean
    }>
    exceptions: Array<{
      date: string
      type: "leave" | "special"
      startTime?: string
      endTime?: string
      reason?: string
    }>
  }>
}

interface ReviewStepProps {
  data: OnboardingData
  onEdit: (step: number) => void
  onSubmit: () => void
  onBack: () => void
  isLoading: boolean
}

export function ReviewStep({ data, onEdit, onSubmit, onBack, isLoading }: ReviewStepProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Review Your Information</h3>
        <p className="text-gray-600">
          Please review all the information below before submitting your onboarding application.
        </p>
      </div>

      {/* Registration Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Full Name</div>
              <div className="text-base">{data.registration.fullName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Email</div>
              <div className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {data.registration.email}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Phone</div>
              <div className="text-base flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {data.registration.phone}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Medical Registration</div>
              <div className="text-base flex items-center gap-2">
                <Award className="w-4 h-4" />
                {data.registration.medicalRegistrationNumber}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Professional Profile
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Specialization</div>
              <div className="text-base">
                <Badge variant="secondary">{data.profile.specialization}</Badge>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Years of Experience</div>
              <div className="text-base">{data.profile.yearsOfExperience} years</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Clinic/Hospital</div>
              <div className="text-base">{data.profile.clinicName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Profile Photo</div>
              <div className="text-base">
                {data.profile.profilePhoto ? (
                  <Badge variant="outline">Photo uploaded</Badge>
                ) : (
                  <span className="text-gray-500">No photo uploaded</span>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Address</div>
            <div className="text-base">{data.profile.address}</div>
          </div>
        </CardContent>
      </Card>

      {/* Locations and Availability */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Practice Locations & Availability
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.locations.map((location, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4" />
                {location.name}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-500">Address</div>
                  <div>{location.address}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-500">Phone</div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    {location.phone}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 font-medium mb-3">
                  <Clock className="w-4 h-4" />
                  Weekly Schedule
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {location.weeklySchedule.map((schedule) => (
                    <div key={schedule.day} className="flex justify-between items-center">
                      <span className="font-medium">{schedule.day}</span>
                      <span>
                        {schedule.isAvailable
                          ? `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`
                          : "Not available"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {location.exceptions.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 font-medium mb-3">
                      <Calendar className="w-4 h-4" />
                      Exceptions ({location.exceptions.length})
                    </div>
                    <div className="space-y-2 text-sm">
                      {location.exceptions.map((exception, exIndex) => (
                        <div key={exIndex} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{formatDate(exception.date)}</div>
                            {exception.reason && <div className="text-gray-500">{exception.reason}</div>}
                          </div>
                          <div className="text-right">
                            <Badge variant={exception.type === "leave" ? "destructive" : "default"}>
                              {exception.type === "leave" ? "Leave" : "Special Session"}
                            </Badge>
                            {exception.type === "special" && exception.startTime && exception.endTime && (
                              <div className="text-xs text-gray-500 mt-1">
                                {formatTime(exception.startTime)} - {formatTime(exception.endTime)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your medical registration will be verified</li>
          <li>• You'll receive an email confirmation once approved</li>
          <li>• You can start accepting appointments after verification</li>
          <li>• You can update your availability anytime from your dashboard</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit} disabled={isLoading} className="min-w-32">
          {isLoading ? "Submitting..." : "Complete Onboarding"}
        </Button>
      </div>
    </div>
  )
}
