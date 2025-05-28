import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialization = searchParams.get("specialization")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simulate available doctors data
    let doctors = [
      {
        id: "doc_1",
        name: "Dr. Sarah Johnson",
        specialization: "Cardiology",
        locations: [
          {
            id: "loc_1",
            name: "Heart Care Center",
            address: "123 Medical Plaza, Suite 200",
          },
          {
            id: "loc_2",
            name: "Downtown Clinic",
            address: "456 Main Street, Floor 3",
          },
        ],
      },
      {
        id: "doc_2",
        name: "Dr. Michael Chen",
        specialization: "Dermatology",
        locations: [
          {
            id: "loc_3",
            name: "Skin Health Clinic",
            address: "789 Health Avenue, Suite 100",
          },
        ],
      },
      {
        id: "doc_3",
        name: "Dr. Emily Davis",
        specialization: "Family Medicine",
        locations: [
          {
            id: "loc_4",
            name: "Family Health Center",
            address: "321 Wellness Drive, Building A",
          },
        ],
      },
    ]

    // Filter by specialization if provided
    if (specialization) {
      doctors = doctors.filter((doc) => doc.specialization.toLowerCase().includes(specialization.toLowerCase()))
    }

    return NextResponse.json({
      success: true,
      data: doctors,
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
