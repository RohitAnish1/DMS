// Book Appointment Dialog Component
// This component provides a modal interface for patients to book new appointments
// It includes doctor selection, location selection, date/time picking, and form validation

"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { apiService } from "@/lib/api"

// TypeScript interface for booking form data
interface BookingData {
  doctorId: string      // Selected doctor's ID
  locationId: string    // Selected location's ID
  date: Date | undefined // Selected appointment date
  time: string          // Selected appointment time
  reason: string        // Reason for the appointment
}

// TypeScript interface for doctor data with locations
interface Doctor {
  id: string
  name: string
  specialization: string
  locations: Array<{
    id: string
    name: string
    address: string
  }>
}

// Props interface for the dialog component
interface BookAppointmentDialogProps {
  open: boolean                    // Controls dialog visibility
  onOpenChange: (open: boolean) => void  // Callback to handle dialog state changes
  onSuccess: () => void           // Callback called when appointment is successfully booked
}

// Main Book Appointment Dialog Component
export function BookAppointmentDialog({ open, onOpenChange, onSuccess }: BookAppointmentDialogProps) {
  // State management for the booking process
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTimes, setIsLoadingTimes] = useState(false)
  const [doctorLoadError, setDoctorLoadError] = useState<string | null>(null)

  // React Hook Form setup for form management and validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookingData>()

  // Watch form fields for reactive updates
  const selectedDoctorId = watch("doctorId")
  const selectedLocationId = watch("locationId")
  const selectedDate = watch("date")
  const selectedTime = watch("time")

  // Find selected doctor from the doctors array
  const selectedDoctor = selectedDoctorId
    ? doctors.find((d) => String(d.id) === String(selectedDoctorId))
    : undefined

  // Load doctors when dialog opens
  useEffect(() => {
    if (open) {
      loadDoctors()
    }
  }, [open])

  // Load available times when doctor, location, and date are selected
  useEffect(() => {
    if (selectedDoctorId && selectedLocationId && selectedDate) {
      loadAvailableTimes()
    }
  }, [selectedDoctorId, selectedLocationId, selectedDate])

  // Fetch available doctors from the API
  // This function loads all doctors that accept appointments
  const loadDoctors = async () => {
    setDoctorLoadError(null)
    try {
      const result = await apiService.getAvailableDoctors()
      if (result.success) {
        const data = result.data
        // Handle different response formats from the API
        if (Array.isArray(data)) {
          setDoctors(data)
        } else if (
          data &&
          typeof data === 'object' &&
          'doctors' in data &&
          Array.isArray((data as any).doctors)
        ) {
          setDoctors((data as any).doctors)
        } else {
          setDoctors([])
          setDoctorLoadError("Unexpected response from server. Please try again later.")
          console.warn("API returned unexpected doctors data:", data)
        }
      } else {
        setDoctors([])
        setDoctorLoadError(result.message || "Failed to load doctors. Please try again later.")
      }
    } catch (err) {
      setDoctors([])
      setDoctorLoadError("Failed to load doctors. Please check your connection and try again.")
      console.error("Error loading doctors:", err)
    }
  }

  // Fetch available appointment times for selected doctor, location, and date
  // This function gets time slots that are available for booking
  const loadAvailableTimes = async () => {
    setIsLoadingTimes(true)
    try {
      const result = await apiService.getAvailableSlots(
        selectedDoctorId!,
        selectedLocationId!,
        selectedDate!.toISOString()
      )
      if (result.success) {
        setAvailableTimes(result.data || [])
      } else {
        setAvailableTimes([])
        console.warn("Failed to load available times:", result.message)
      }
    } catch (err) {
      setAvailableTimes([])
      console.error("Error loading available times:", err)
    } finally {
      setIsLoadingTimes(false)
    }
  }

  // Handle form submission for booking an appointment
  // This function is called when the user submits the booking form
  const onSubmit = async (data: BookingData) => {
    if (!data.date) return

    setIsLoading(true)
    try {
      const result = await apiService.bookAppointment({
        doctorId: data.doctorId,
        locationId: data.locationId,
        date: format(data.date, "yyyy-MM-dd"),
        time: data.time,
        reason: data.reason,
      })

      if (result.success) {
        onSuccess()
        reset()
      }
    } catch (err) {
      console.error("Failed to book appointment:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle dialog close event
  // This function resets the form and available times, and closes the dialog
  const handleClose = () => {
    reset()
    setAvailableTimes([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Book New Appointment</DialogTitle>
          <DialogDescription>Select a doctor, location, date, and time for your appointment.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="doctorId">Doctor *</Label>
            {doctorLoadError && (
              <p className="text-sm text-red-600">{doctorLoadError}</p>
            )}
            <Select value={selectedDoctorId} onValueChange={(value) => setValue("doctorId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {(Array.isArray(doctors) ? doctors : []).map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div>
                      <div className="font-medium">{doctor.name}</div>
                      <div className="text-sm text-gray-500">{doctor.specialization}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.doctorId && <p className="text-sm text-red-600">Please select a doctor</p>}
          </div>

          {selectedDoctor && (
            <div className="space-y-2">
              <Label htmlFor="locationId">Location *</Label>
              <Select value={selectedLocationId} onValueChange={(value) => setValue("locationId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDoctor.locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      <div>
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-gray-500">{location.address}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.locationId && <p className="text-sm text-red-600">Please select a location</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label>Appointment Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setValue("date", date)}
                  disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-red-600">Please select a date</p>}
          </div>

          {selectedDate && selectedLocationId && (
            <div className="space-y-2">
              <Label htmlFor="time">Available Times *</Label>
              {isLoadingTimes ? (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Loading available times...</span>
                </div>
              ) : availableTimes.length > 0 ? (
                <Select value={selectedTime} onValueChange={(value) => setValue("time", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {format(new Date(`2000-01-01T${time}`), "h:mm a")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-gray-500">No available times for this date</p>
              )}
              {errors.time && <p className="text-sm text-red-600">Please select a time</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit *</Label>
            <Textarea
              id="reason"
              {...register("reason", {
                required: "Please provide a reason for your visit",
                minLength: {
                  value: 10,
                  message: "Please provide more details (at least 10 characters)",
                },
              })}
              placeholder="Describe the reason for your appointment..."
              rows={3}
            />
            {errors.reason && <p className="text-sm text-red-600">{errors.reason.message}</p>}
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !availableTimes.length}>
              {isLoading ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
