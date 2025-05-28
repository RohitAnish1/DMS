"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { X, User } from "lucide-react"

interface ProfileData {
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  profilePhoto?: File
}

interface PatientProfileFormProps {
  initialData: ProfileData & { profilePhoto?: string }
  onSubmit: (data: ProfileData) => void
  isLoading: boolean
}

export function PatientProfileForm({ initialData, onSubmit, isLoading }: PatientProfileFormProps) {
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData.profilePhoto || null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileData>({
    defaultValues: {
      fullName: initialData.fullName,
      email: initialData.email,
      phone: initialData.phone,
      dateOfBirth: initialData.dateOfBirth,
      gender: initialData.gender,
      address: initialData.address,
    },
  })

  const selectedGender = watch("gender")

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      setProfilePhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setProfilePhoto(null)
    setPhotoPreview(initialData.profilePhoto || null)
  }

  const handleFormSubmit = (data: ProfileData) => {
    onSubmit({
      ...data,
      profilePhoto: profilePhoto || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
                placeholder="John Smith"
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
                placeholder="john@example.com"
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
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth", {
                  required: "Date of birth is required",
                })}
              />
              {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={selectedGender} onValueChange={(value) => setValue("gender", value)}>
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
              placeholder="123 Main Street, City, State 12345"
              rows={3}
            />
            {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-6">
                <div className="relative flex flex-col items-center justify-center">
                  {photoPreview ? (
                    <div className="relative">
                      <img
                        src={photoPreview || "/placeholder.svg"}
                        alt="Profile preview"
                        className="w-32 h-32 rounded-full mx-auto object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-0 right-0 rounded-full w-6 h-6 p-0"
                        onClick={removePhoto}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer w-full">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <div className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</div>
                      <div className="text-xs text-gray-500">PNG, JPG up to 5MB</div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
