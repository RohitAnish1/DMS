import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simulate patient appointments data
    const appointments = [
      {
        id: "apt_1",
        doctorName: "Dr. Sarah Johnson",
        doctorSpecialization: "Cardiologist",
        locationName: "Heart Care Center",
        date: "2024-01-15",
        time: "10:00",
        status: "upcoming",
        reason: "Regular checkup and blood pressure monitoring",
        notes: "Please bring previous test results",
      },
      {
        id: "apt_2",
        doctorName: "Dr. Michael Chen",
        doctorSpecialization: "Dermatologist",
        locationName: "Skin Health Clinic",
        date: "2024-01-20",
        time: "14:30",
        status: "upcoming",
        reason: "Skin examination and mole check",
      },
      {
        id: "apt_3",
        doctorName: "Dr. Emily Davis",
        doctorSpecialization: "Family Medicine",
        locationName: "Family Health Center",
        date: "2023-12-10",
        time: "09:00",
        status: "completed",
        reason: "Annual physical examination",
        notes: "All tests came back normal",
      },
    ]

    return NextResponse.json({
      success: true,
      data: appointments,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { doctorId, locationId, date, time, reason } = body

    // Validate required fields
    if (!doctorId || !locationId || !date || !time || !reason) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 },
      )
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate successful appointment booking
    return NextResponse.json({
      success: true,
      data: {
        id: `apt_${Date.now()}`,
        doctorId,
        locationId,
        date,
        time,
        reason,
        status: "upcoming",
      },
      message: "Appointment booked successfully",
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
