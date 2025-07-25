// API Service - Frontend service for communicating with the backend
// This service handles all HTTP requests to the backend API
// It includes authentication, error handling, and response formatting

// Standard API response format used throughout the application
interface ApiResponse<T = any> {
  success: boolean    // Indicates if the request was successful
  data?: T           // Response data (if successful)
  message?: string   // Error or success message
  errors?: Record<string, string[]>  // Validation errors (if any)
}

// Main API service class that handles all backend communication
class ApiService {
  private baseUrl: string

  constructor() {
    // Set base URL from environment variable or default to localhost
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3000"
  }

  // Retrieve authentication token from local storage
  // Used for authenticated requests to protected endpoints
  private getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  // Generic HTTP request method with authentication and error handling
  // This method is used by all other API methods to make requests
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      // Get authentication token if available
      const token = this.getToken();
      
      // Prepare headers with authentication and content type
      let baseHeaders: Record<string, string> = { "Content-Type": "application/json" };
      
      // Merge headers from options, handling both plain objects and Headers instances
      if (options.headers) {
        if (options.headers instanceof Headers) {
          (options.headers as Headers).forEach((value, key) => {
            baseHeaders[key] = value;
          });
        } else {
          baseHeaders = { ...baseHeaders, ...options.headers as Record<string, string> };
        }
      }
      
      // Add authorization header if token exists
      if (token) {
        baseHeaders["Authorization"] = `Bearer ${token}`;
      }
      
      // Make the HTTP request
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: baseHeaders,
      })

      // Parse JSON response
      const data = await response.json()

      // Handle error responses
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "An error occurred",
          errors: data.errors,
        }
      }

      // Successful response
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      }
    } catch (error) {
      // Network or unexpected error
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
    return this.request("/doctors/register", {
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
  }) {
    // No FormData, just send JSON
    return this.request("/doctors/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  }

  // Add Practice Location
  async addPracticeLocation(data: {
    name: string
    address: string
    phone: string
  }) {
    return this.request("/doctors/locations", {
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
    return this.request(`/doctors/locations/${locationId}/availability`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Complete Onboarding
  async completeOnboarding() {
    return this.request("/doctors/complete-onboarding", {
      method: "POST",
    })
  }

  // Get Specializations
  async getSpecializations() {
    return this.request("/doctors/specializations")
  }

  // Patient Authentication
  async loginPatient(data: {
    email: string
    password: string
  }) {
    return this.request("/patients/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async registerPatient(data: {
    fullName: string
    email: string
    password: string
    phone: string
    dateOfBirth: string
    gender: string
    address: string
  }) {
    return this.request("/patients/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Patient Profile
  async getPatientProfile() {
    return this.request("/patients/profile")
  }

  async updatePatientProfile(data: {
    fullName: string
    email: string
    phone: string
    dateOfBirth: string
    gender: string
    address: string
    profilePhoto?: File
  }) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string | Blob)
      }
    })

    return this.request("/patients/profile", {
      method: "PUT",
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    })
  }

  // Patient Appointments
  async getPatientAppointments() {
    return this.request("/patients/appointments")
  }

  async bookAppointment(data: {
    doctorId: string
    locationId: string
    date: string
    time: string
    reason: string
  }) {
    return this.request("/patients/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async cancelAppointment(appointmentId: string) {
    return this.request(`/patients/appointments/${appointmentId}`, {
      method: "DELETE",
    })
  }

  async rescheduleAppointment(
    appointmentId: string,
    data: {
      date: string
      time: string
    },
  ) {
    return this.request(`/patients/appointments/${appointmentId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Get available doctors for booking
  async getAvailableDoctors(specialization?: string) {
    const params = specialization ? `?specialization=${encodeURIComponent(specialization)}` : ""
    return this.request(`/doctors/available${params}`)
  }

  async getDoctorAvailability(doctorId: string, locationId: string, date: string) {
    return this.request(`/doctors/${doctorId}/locations/${locationId}/availability?date=${date}`)
  }
}

export const apiService = new ApiService()
