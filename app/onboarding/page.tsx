// Doctor Onboarding Page - Multi-step registration process for doctors
// This page guides doctors through a complete registration process including:
// 1. Basic registration (credentials, contact info)
// 2. Profile setup (specialization, experience, clinic details)
// 3. Availability setup (locations, schedules, exceptions)
// 4. Review and confirmation

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

// TypeScript interface for complete onboarding data structure
interface OnboardingData {
  // Step 1: Basic registration information
  registration: {
    email: string
    password: string
    fullName: string
    phone: string
    medicalRegistrationNumber: string  // Doctor's license number
  }
  
  // Step 2: Professional profile information
  profile: {
    specialization: string
    yearsOfExperience: number
    clinicName: string
    address: string
    profilePhoto?: File  // Optional profile image
  }
  
  // Step 3: Practice locations and availability
  locations: Array<{
    id?: string
    name: string
    address: string
    phone: string
    // Weekly schedule for this location
    weeklySchedule: Array<{
      day: string
      startTime: string
      endTime: string
      isAvailable: boolean
    }>
    // Special exceptions and time-off
    exceptions: Array<{
      date: string
      type: "leave" | "special"
      startTime?: string
      endTime?: string
      reason?: string
    }>
  }>
}

// Onboarding step configuration
const steps = [
  {
    title: "Registration",
    description: "Create your account and verify your credentials",
  },
  {
    title: "Profile Setup",
    description: "Tell us about your practice and specialization",
  },
  {
    title: "Availability",
    description: "Set up your locations and schedule",
  },
  {
    title: "Review",
    description: "Review and confirm your information",
  },
]

// Main Doctor Onboarding Page Component
export default function DoctorOnboardingPage() {
  const router = useRouter()
  
  // State management for the onboarding process
  const [currentStep, setCurrentStep] = useState(0)
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

  // Handle step completion and data updates
  // This function is called when each step is completed
  const handleStepComplete = (stepData: any) => {
    setError(null)
    
    // Update the onboarding data with the step's data
    setOnboardingData((prev) => ({
      ...prev,
      ...stepData,
    }))
    
    // Move to next step or complete onboarding
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // Final step - submit all data
      handleSubmitOnboarding({
        ...onboardingData,
        ...stepData,
      })
    }
  }

  // Submit complete onboarding data to the backend
  // This function sends all collected data to create the doctor account
  const handleSubmitOnboarding = async (data: OnboardingData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await apiService.completeDoctorOnboarding(data)
      
      if (result.success) {
        // Store authentication token if provided
        if (result.data?.token) {
          localStorage.setItem("token", result.data.token)
        }
        
        // Redirect to doctor dashboard
        router.push("/doctor/dashboard")
      } else {
        setError(result.message || "Failed to complete onboarding")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Onboarding error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Navigate to previous step
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // Calculate progress percentage for progress bar
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Onboarding Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Onboarding</h1>
          <p className="mt-2 text-gray-600">
            Complete your registration to start managing your practice with Schedula
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Step Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Alert */}
            {error && (
              <Alert className="mb-6" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step Content - Renders different components based on current step */}
            {currentStep === 0 && (
              <RegistrationStep
                data={onboardingData.registration}
                onComplete={handleStepComplete}
                isLoading={isLoading}
              />
            )}
            {currentStep === 1 && (
              <ProfileSetupStep
                data={onboardingData.profile}
                onComplete={handleStepComplete}
                onPrevious={handlePreviousStep}
                isLoading={isLoading}
              />
            )}
            {currentStep === 2 && (
              <AvailabilityStep
                data={onboardingData.locations}
                onComplete={handleStepComplete}
                onPrevious={handlePreviousStep}
                isLoading={isLoading}
              />
            )}
            {currentStep === 3 && (
              <ReviewStep
                data={onboardingData}
                onComplete={handleStepComplete}
                onPrevious={handlePreviousStep}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>

        {/* Step Navigation Indicators */}
        <div className="flex justify-center space-x-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index <= currentStep ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
