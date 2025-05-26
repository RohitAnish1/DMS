interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3000"
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "An error occurred",
          errors: data.errors,
        }
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      }
    } catch (error) {
      return {
        success: false,
        message: "Network error occurred",
      }
    }
  }

  // Doctor Registration
  async registerDoctor(data: {
    email: string
    password: string
    fullName: string
    phone: string
    medicalRegistrationNumber: string
  }) {
    return this.request("/api/doctors/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Doctor Profile Setup
  async setupProfile(data: {
    specialization: string
    yearsOfExperience: number
    clinicName: string
    address: string
    profilePhoto?: File
  }) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string | Blob)
      }
    })

    return this.request("/api/doctors/profile", {
      method: "POST",
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    })
  }

  // Add Practice Location
  async addPracticeLocation(data: {
    name: string
    address: string
    phone: string
  }) {
    return this.request("/api/doctors/locations", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Set Availability
  async setAvailability(
    locationId: string,
    data: {
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
    },
  ) {
    return this.request(`/api/doctors/locations/${locationId}/availability`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Complete Onboarding
  async completeOnboarding() {
    return this.request("/api/doctors/complete-onboarding", {
      method: "POST",
    })
  }

  // Get Specializations
  async getSpecializations() {
    return this.request("/api/doctors/specializations")
  }
}

export const apiService = new ApiService()
