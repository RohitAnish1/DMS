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

interface BookingData {
  doctorId: string
  locationId: string
  date: Date | undefined
  time: string
  reason: string
}

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

interface BookAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function BookAppointmentDialog({ open, onOpenChange, onSuccess }: BookAppointmentDialogProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTimes, setIsLoadingTimes] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookingData>()

  const selectedDoctorId = watch("doctorId")
  const selectedLocationId = watch("locationId")
  const selectedDate = watch("date")
  const selectedTime = watch("time")

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId)

  useEffect(() => {
    if (open) {
      loadDoctors()
    }
  }, [open])

  useEffect(() => {
    if (selectedDoctorId && selectedLocationId && selectedDate) {
      loadAvailableTimes()
    }
  }, [selectedDoctorId, selectedLocationId, selectedDate])

  const loadDoctors = async () => {
    try {
      const result = await apiService.getAvailableDoctors()
      if (result.success) {
        setDoctors(result.data)
      }
    } catch (err) {
      console.error("Failed to load doctors:", err)
    }
  }

  const loadAvailableTimes = async () => {
    if (!selectedDoctorId || !selectedLocationId || !selectedDate) return

    setIsLoadingTimes(true)
    try {
      const dateString = format(selectedDate, "yyyy-MM-dd")
      const result = await apiService.getDoctorAvailability(selectedDoctorId, selectedLocationId, dateString)
      if (result.success) {
        setAvailableTimes(result.data.availableTimes || [])
      }
    } catch (err) {
      console.error("Failed to load available times:", err)
      setAvailableTimes([])
    } finally {
      setIsLoadingTimes(false)
    }
  }

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
            <Select value={selectedDoctorId} onValueChange={(value) => setValue("doctorId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
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
