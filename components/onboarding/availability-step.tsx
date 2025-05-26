"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, MapPin, Clock, Calendar } from "lucide-react"

interface WeeklySchedule {
  day: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface Exception {
  date: string
  type: "leave" | "special"
  startTime?: string
  endTime?: string
  reason?: string
}

interface Location {
  id?: string
  name: string
  address: string
  phone: string
  weeklySchedule: WeeklySchedule[]
  exceptions: Exception[]
}

interface AvailabilityStepProps {
  initialData: Location[]
  onComplete: (data: Location[]) => void
  onBack: () => void
  isLoading: boolean
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const defaultSchedule: WeeklySchedule[] = daysOfWeek.map((day) => ({
  day,
  startTime: "09:00",
  endTime: "17:00",
  isAvailable: day !== "Saturday" && day !== "Sunday",
}))

export function AvailabilityStep({ initialData, onComplete, onBack, isLoading }: AvailabilityStepProps) {
  const [activeLocationIndex, setActiveLocationIndex] = useState(0)

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<{
    locations: Location[]
  }>({
    defaultValues: {
      locations:
        initialData.length > 0
          ? initialData
          : [
              {
                name: "",
                address: "",
                phone: "",
                weeklySchedule: defaultSchedule,
                exceptions: [],
              },
            ],
    },
  })

  const {
    fields: locationFields,
    append: appendLocation,
    remove: removeLocation,
  } = useFieldArray({
    control,
    name: "locations",
  })

  const {
    fields: exceptionFields,
    append: appendException,
    remove: removeException,
  } = useFieldArray({
    control,
    name: `locations.${activeLocationIndex}.exceptions`,
  })

  const locations = watch("locations")
  const currentLocation = locations[activeLocationIndex]

  const addLocation = () => {
    appendLocation({
      name: "",
      address: "",
      phone: "",
      weeklySchedule: defaultSchedule,
      exceptions: [],
    })
    setActiveLocationIndex(locationFields.length)
  }

  const addException = () => {
    appendException({
      date: "",
      type: "leave",
      reason: "",
    })
  }

  const updateScheduleDay = (dayIndex: number, field: keyof WeeklySchedule, value: any) => {
    const currentSchedule = currentLocation.weeklySchedule
    const updatedSchedule = [...currentSchedule]
    updatedSchedule[dayIndex] = { ...updatedSchedule[dayIndex], [field]: value }
    setValue(`locations.${activeLocationIndex}.weeklySchedule`, updatedSchedule)
  }

  const onSubmit = (data: { locations: Location[] }) => {
    onComplete(data.locations)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Practice Locations & Availability</h3>
        <Button type="button" onClick={addLocation} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      {locationFields.length > 0 && (
        <Tabs
          value={activeLocationIndex.toString()}
          onValueChange={(value) => setActiveLocationIndex(Number.parseInt(value))}
        >
          <TabsList className="grid w-full grid-cols-auto">
            {locationFields.map((field, index) => (
              <TabsTrigger key={field.id} value={index.toString()} className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {locations[index]?.name || `Location ${index + 1}`}
                {locationFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeLocation(index)
                      if (activeLocationIndex >= index && activeLocationIndex > 0) {
                        setActiveLocationIndex(activeLocationIndex - 1)
                      }
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {locationFields.map((field, locationIndex) => (
            <TabsContent key={field.id} value={locationIndex.toString()} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`location-name-${locationIndex}`}>Location Name *</Label>
                      <Input
                        id={`location-name-${locationIndex}`}
                        {...register(`locations.${locationIndex}.name`, {
                          required: "Location name is required",
                        })}
                        placeholder="Main Clinic"
                      />
                      {errors.locations?.[locationIndex]?.name && (
                        <p className="text-sm text-red-600">{errors.locations[locationIndex]?.name?.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`location-phone-${locationIndex}`}>Phone Number *</Label>
                      <Input
                        id={`location-phone-${locationIndex}`}
                        type="tel"
                        {...register(`locations.${locationIndex}.phone`, {
                          required: "Phone number is required",
                        })}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.locations?.[locationIndex]?.phone && (
                        <p className="text-sm text-red-600">{errors.locations[locationIndex]?.phone?.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`location-address-${locationIndex}`}>Address *</Label>
                    <Textarea
                      id={`location-address-${locationIndex}`}
                      {...register(`locations.${locationIndex}.address`, {
                        required: "Address is required",
                      })}
                      placeholder="123 Medical Center Drive, Suite 100, City, State 12345"
                      rows={2}
                    />
                    {errors.locations?.[locationIndex]?.address && (
                      <p className="text-sm text-red-600">{errors.locations[locationIndex]?.address?.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Weekly Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentLocation?.weeklySchedule?.map((schedule, dayIndex) => (
                      <div key={schedule.day} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 min-w-24">
                          <Checkbox
                            checked={schedule.isAvailable}
                            onCheckedChange={(checked) => updateScheduleDay(dayIndex, "isAvailable", checked)}
                          />
                          <Label className="font-medium">{schedule.day}</Label>
                        </div>

                        {schedule.isAvailable && (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              type="time"
                              value={schedule.startTime}
                              onChange={(e) => updateScheduleDay(dayIndex, "startTime", e.target.value)}
                              className="w-32"
                            />
                            <span className="text-gray-500">to</span>
                            <Input
                              type="time"
                              value={schedule.endTime}
                              onChange={(e) => updateScheduleDay(dayIndex, "endTime", e.target.value)}
                              className="w-32"
                            />
                          </div>
                        )}

                        {!schedule.isAvailable && <div className="flex-1 text-gray-500 italic">Not available</div>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Exceptions (Leaves & Special Sessions)
                    </div>
                    <Button type="button" onClick={addException} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Exception
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {exceptionFields.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No exceptions added. Click "Add Exception" to add leaves or special sessions.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {exceptionFields.map((field, exceptionIndex) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Exception {exceptionIndex + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeException(exceptionIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Date *</Label>
                              <Input
                                type="date"
                                {...register(`locations.${locationIndex}.exceptions.${exceptionIndex}.date`, {
                                  required: "Date is required",
                                })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Type *</Label>
                              <Select
                                value={currentLocation?.exceptions?.[exceptionIndex]?.type}
                                onValueChange={(value) =>
                                  setValue(
                                    `locations.${locationIndex}.exceptions.${exceptionIndex}.type`,
                                    value as "leave" | "special",
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="leave">Leave/Holiday</SelectItem>
                                  <SelectItem value="special">Special Session</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Reason</Label>
                              <Input
                                {...register(`locations.${locationIndex}.exceptions.${exceptionIndex}.reason`)}
                                placeholder="Vacation, Conference, etc."
                              />
                            </div>
                          </div>

                          {currentLocation?.exceptions?.[exceptionIndex]?.type === "special" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Start Time</Label>
                                <Input
                                  type="time"
                                  {...register(`locations.${locationIndex}.exceptions.${exceptionIndex}.startTime`)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>End Time</Label>
                                <Input
                                  type="time"
                                  {...register(`locations.${locationIndex}.exceptions.${exceptionIndex}.endTime`)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

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
