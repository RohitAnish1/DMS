"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RegistrationStep } from "@/components/onboarding/registration-step"
import { ProfileSetupStep } from "@/components/onboarding/profile-setup-step"
import { AvailabilityStep } from "@/components/onboarding/availability-step"
import { ReviewStep } from "@/components/onboarding/review-step"
import { apiService } from "@/lib/api"

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

const steps = [
  { id: 1, title: "Registration", description: "Create your account" },
  { id: 2, title: "Profile Setup", description: "Complete your profile" },
  { id: 3, title: "Availability", description: "Set your schedule" },
  { id: 4, title: "Review", description: "Review and submit" },
]

export default function DoctorOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    registration: {
      email: "",
      password: "",
      fullName: "",
      phone: "",
      medicalRegistrationNumber: "",
    },
    profile: {
      specialization: "",
      yearsOfExperience: 0,
      clinicName: "",
      address: "",
    },
    locations: [],
  })

  const progress = (currentStep / steps.length) * 100

  const handleStepComplete = (stepData: any) => {
    setError(null)

    switch (currentStep) {
      case 1:
        setOnboardingData((prev) => ({ ...prev, registration: stepData }))
        break
      case 2:
        setOnboardingData((prev) => ({ ...prev, profile: stepData }))
        break
      case 3:
        setOnboardingData((prev) => ({ ...prev, locations: stepData }))
        break
    }

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleEdit = (step: number) => {
    setCurrentStep(step)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Register doctor
      const registrationResult = await apiService.registerDoctor(onboardingData.registration)
      if (!registrationResult.success) {
        throw new Error(registrationResult.message)
      }

      // Setup profile
      const profileResult = await apiService.setupProfile(onboardingData.profile)
      if (!profileResult.success) {
        throw new Error(profileResult.message)
      }

      // Add locations and availability
      for (const location of onboardingData.locations) {
        const locationResult = await apiService.addPracticeLocation({
          name: location.name,
          address: location.address,
          phone: location.phone,
        })

        if (!locationResult.success) {
          throw new Error(locationResult.message)
        }

        const locationId = locationResult.data.id

        const availabilityResult = await apiService.setAvailability(locationId, {
          weeklySchedule: location.weeklySchedule,
          exceptions: location.exceptions,
        })

        if (!availabilityResult.success) {
          throw new Error(availabilityResult.message)
        }
      }

      // Complete onboarding
      const completeResult = await apiService.completeOnboarding()
      if (!completeResult.success) {
        throw new Error(completeResult.message)
      }

      // Redirect to dashboard
      router.push("/dashboard/profile")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during onboarding")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RegistrationStep
            initialData={onboardingData.registration}
            onComplete={handleStepComplete}
            isLoading={isLoading}
          />
        )
      case 2:
        return (
          <ProfileSetupStep
            initialData={onboardingData.profile}
            onComplete={handleStepComplete}
            onBack={handleBack}
            isLoading={isLoading}
          />
        )
      case 3:
        return (
          <AvailabilityStep
            initialData={onboardingData.locations}
            onComplete={handleStepComplete}
            onBack={handleBack}
            isLoading={isLoading}
          />
        )
      case 4:
        return (
          <ReviewStep
            data={onboardingData}
            onEdit={handleEdit}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Welcome to Schedula</h1>
          <p className="text-gray-600 text-center mb-6">Complete your onboarding to start managing your practice</p>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-center space-x-8 mb-8">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`text-center ${step.id <= currentStep ? "text-blue-600" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                    step.id < currentStep
                      ? "bg-blue-600 text-white"
                      : step.id === currentStep
                        ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                        : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step.id < currentStep ? "✓" : step.id}
                </div>
                <div className="text-xs font-medium">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
            <CardDescription>{steps[currentStep - 1]?.description}</CardDescription>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
        </Card>
      </div>
    </div>
  )
}
