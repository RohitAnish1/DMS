"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { apiService } from "@/lib/api"

interface RescheduleData {
  date: Date | undefined
  time: string
}

interface Appointment {
  id: string
  doctorName: string
  doctorSpecialization: string
  locationName: string
  date: string
  time: string
  status: string
  reason: string
}

interface RescheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (date: string, time: string) => void
  appointment?: Appointment
}

export function RescheduleDialog({ open, onOpenChange, onConfirm, appointment }: RescheduleDialogProps) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [isLoadingTimes, setIsLoadingTimes] = useState(false)

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RescheduleData>()

  const selectedDate = watch("date")
  const selectedTime = watch("time")

  useEffect(() => {
    if (selectedDate && appointment) {
      loadAvailableTimes()
    }
  }, [selectedDate, appointment])

  const loadAvailableTimes = async () => {
    if (!selectedDate || !appointment) return

    setIsLoadingTimes(true)
    try {
      const dateString = format(selectedDate, "yyyy-MM-dd")
      // In a real app, you'd extract doctorId and locationId from the appointment
      const result = await apiService.getDoctorAvailability("doctor_123", "location_123", dateString)
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

  const onSubmit = (data: RescheduleData) => {
    if (!data.date) return

    const dateString = format(data.date, "yyyy-MM-dd")
    onConfirm(dateString, data.time)
    reset()
  }

  const handleClose = () => {
    reset()
    setAvailableTimes([])
    onOpenChange(false)
  }

  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>
            Select a new date and time for your appointment with {appointment.doctorName}.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Current Appointment</h4>
          <p className="text-sm text-gray-600">
            {format(new Date(appointment.date), "PPP")} at{" "}
            {format(new Date(`2000-01-01T${appointment.time}`), "h:mm a")}
          </p>
          <p className="text-sm text-gray-600">{appointment.locationName}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>New Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a new date"}
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
          </div>

          {selectedDate && (
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
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedDate || !selectedTime || !availableTimes.length}>
              Reschedule
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
