// Patient Registration Form Component
// This component handles patient account creation with comprehensive form validation
// It collects personal information, contact details, and medical history

"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiService } from "@/lib/api"

// TypeScript interface for patient registration form data
interface RegistrationData {
  fullName: string
  email: string
  password: string
  confirmPassword: string  // For password confirmation validation
  phone: string
  dateOfBirth: string
  gender: string
  address: string
}

// Props interface for the component
interface PatientRegistrationFormProps {
  onSuccess: () => void                      // Callback for successful registration
  onError: (error: string) => void          // Callback for registration errors
  isLoading: boolean                        // Loading state from parent
  setIsLoading: (loading: boolean) => void  // Function to update loading state
}

// Main Patient Registration Form Component
export function PatientRegistrationForm({ onSuccess, onError, isLoading, setIsLoading }: PatientRegistrationFormProps) {
  // React Hook Form setup with validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationData>()

  // Watch form fields for reactive validation
  const password = watch("password")
  const selectedGender = watch("gender")

  // Handle form submission
  // This function processes the registration data and calls the API
  const onSubmit = async (data: RegistrationData) => {
    setIsLoading(true)
    onError("")

    try {
      // Remove confirmPassword from submission data
      const { confirmPassword, ...submitData } = data
      const result = await apiService.registerPatient(submitData)

      if (result.success) {
        // Store authentication token if provided
        const token = (result.data as any)?.token;
        if (token) {
          localStorage.setItem("token", token);
        }
        onSuccess();
      } else {
        onError(result.message || "Registration failed")
      }
    } catch (err) {
      onError("An unexpected error occurred")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name Field */}
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
          placeholder="John Smith"
        />
        {errors.fullName && <p className="text-sm text-red-600">{errors.fullName.message}</p>}
      </div>

      {/* Email and Phone Fields Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email Field */}
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
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[+]?[1-9][\d\s\-\(\)]{8,}$/,
                message: "Invalid phone number",
              },
            })}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Password Fields Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Password Field */}
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
                message: "Password must contain uppercase, lowercase, and number",
              },
            })}
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            })}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      {/* Date of Birth and Gender Fields Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date of Birth Field */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            {...register("dateOfBirth", {
              required: "Date of birth is required",
              validate: (value) => {
                const date = new Date(value)
                const today = new Date()
                return date < today || "Date of birth must be in the past"
              },
            })}
          />
          {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>}
        </div>

        {/* Gender Selection Field */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select onValueChange={(value) => setValue("gender", value)} value={selectedGender}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-red-600">{errors.gender.message}</p>}
        </div>
      </div>

      {/* Address Field */}
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          {...register("address", {
            required: "Address is required",
            minLength: {
              value: 10,
              message: "Address must be at least 10 characters",
            },
          })}
          placeholder="123 Main Street, City, State, ZIP"
          rows={3}
        />
        {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  )
}
