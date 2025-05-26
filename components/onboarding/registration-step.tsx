"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RegistrationData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  phone: string
  medicalRegistrationNumber: string
}

interface RegistrationStepProps {
  initialData: Omit<RegistrationData, "confirmPassword">
  onComplete: (data: Omit<RegistrationData, "confirmPassword">) => void
  isLoading: boolean
}

export function RegistrationStep({ initialData, onComplete, isLoading }: RegistrationStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationData>({
    defaultValues: {
      ...initialData,
      confirmPassword: "",
    },
  })

  const password = watch("password")

  const onSubmit = (data: RegistrationData) => {
    const { confirmPassword, ...submitData } = data
    onComplete(submitData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            {...register("fullName", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Full name must be at least 2 characters",
              },
            })}
            placeholder="Dr. John Smith"
          />
          {errors.fullName && <p className="text-sm text-red-600">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            placeholder="doctor@example.com"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[+]?[1-9][\d]{0,15}$/,
                message: "Invalid phone number",
              },
            })}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicalRegistrationNumber">Medical Registration Number *</Label>
          <Input
            id="medicalRegistrationNumber"
            {...register("medicalRegistrationNumber", {
              required: "Medical registration number is required",
              minLength: {
                value: 5,
                message: "Registration number must be at least 5 characters",
              },
            })}
            placeholder="MED123456"
          />
          {errors.medicalRegistrationNumber && (
            <p className="text-sm text-red-600">{errors.medicalRegistrationNumber.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
              },
            })}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            })}
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <Alert>
        <AlertDescription>
          By creating an account, you agree to our Terms of Service and Privacy Policy. Your medical registration number
          will be verified before account activation.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="min-w-32">
          {isLoading ? "Creating Account..." : "Continue"}
        </Button>
      </div>
    </form>
  )
}
