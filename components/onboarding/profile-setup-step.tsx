"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { apiService } from "@/lib/api"

interface ProfileData {
  specialization: string
  yearsOfExperience: number
  clinicName: string
  address: string
}

interface ProfileSetupStepProps {
  initialData: ProfileData
  onComplete: (data: ProfileData) => void
  onBack: () => void
  isLoading: boolean
}

export function ProfileSetupStep({ initialData, onComplete, onBack, isLoading }: ProfileSetupStepProps) {
  const [specializations, setSpecializations] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileData>({
    defaultValues: initialData,
  })

  const selectedSpecialization = watch("specialization")

  useEffect(() => {
    const loadSpecializations = async () => {
      const result = await apiService.getSpecializations()
      if (
        result.success &&
        Array.isArray(result.data) &&
        result.data.every((s) => typeof s === "string")
      ) {
        setSpecializations(result.data)
      } else {
        // Fallback specializations
        setSpecializations([
          "Cardiology",
          "Dermatology",
          "Emergency Medicine",
          "Family Medicine",
          "Internal Medicine",
          "Neurology",
          "Oncology",
          "Orthopedics",
          "Pediatrics",
          "Psychiatry",
          "Radiology",
          "Surgery",
        ])
      }
    }

    loadSpecializations()
  }, [])

  const onSubmit = (data: ProfileData) => {
    onComplete(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="specialization">Medical Specialization *</Label>
            <Select value={selectedSpecialization} onValueChange={(value) => setValue("specialization", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your specialization" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(specializations) && specializations.length > 0 ? (
                  specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-gray-500 px-4 py-2">No specializations available</div>
                )}
              </SelectContent>
            </Select>
            {errors.specialization && <p className="text-sm text-red-600">{errors.specialization.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
            <Input
              id="yearsOfExperience"
              type="number"
              min="0"
              max="50"
              {...register("yearsOfExperience", {
                required: "Years of experience is required",
                min: {
                  value: 0,
                  message: "Years of experience cannot be negative",
                },
                max: {
                  value: 50,
                  message: "Years of experience cannot exceed 50",
                },
              })}
              placeholder="5"
            />
            {errors.yearsOfExperience && <p className="text-sm text-red-600">{errors.yearsOfExperience.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinicName">Clinic/Hospital Name *</Label>
            <Input
              id="clinicName"
              {...register("clinicName", {
                required: "Clinic/Hospital name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              placeholder="City General Hospital"
            />
            {errors.clinicName && <p className="text-sm text-red-600">{errors.clinicName.message}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Practice Address *</Label>
        <Textarea
          id="address"
          {...register("address", {
            required: "Practice address is required",
            minLength: {
              value: 10,
              message: "Address must be at least 10 characters",
            },
          })}
          placeholder="123 Medical Center Drive, Suite 100, City, State 12345"
          rows={3}
        />
        {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-32">
          {isLoading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  )
}
