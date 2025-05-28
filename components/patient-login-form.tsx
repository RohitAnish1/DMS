"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { apiService } from "@/lib/api"

interface LoginData {
  email: string
  password: string
  rememberMe: boolean
}

interface PatientLoginFormProps {
  onSuccess: () => void
  onError: (error: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export function PatientLoginForm({ onSuccess, onError, isLoading, setIsLoading }: PatientLoginFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginData>({
    defaultValues: {
      rememberMe: false,
    },
  })

  const rememberMe = watch("rememberMe")

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true)
    onError("")

    try {
      const result = await apiService.loginPatient({
        email: data.email,
        password: data.password,
      })

      if (result.success) {
        // Store authentication token if provided
        const token = (result.data as any)?.token
        if (token) {
          localStorage.setItem("token", token)
        }
        onSuccess()
      } else {
        onError(result.message || "Login failed")
      }
    } catch (err) {
      onError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
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
          autoComplete="email"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password", {
            required: "Password is required",
          })}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="rememberMe"
          checked={rememberMe}
          onCheckedChange={(checked) => setValue("rememberMe", checked as boolean)}
        />
        <Label htmlFor="rememberMe" className="text-sm font-normal">
          Remember me for 30 days
        </Label>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  )
}
