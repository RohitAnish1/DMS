import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { doctorId: string; locationId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const { doctorId, locationId } = params

    if (!date) {
      return NextResponse.json(
        {
          success: false,
          message: "Date parameter is required",
        },
        { status: 400 },
      )
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simulate available time slots
    const availableTimes = [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
    ]

    return NextResponse.json({
      success: true,
      data: {
        doctorId,
        locationId,
        date,
        availableTimes,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
