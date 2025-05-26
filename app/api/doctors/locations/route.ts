import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, address, phone } = body

    // Validate required fields
    if (!name || !address || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 },
      )
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simulate successful location creation
    return NextResponse.json({
      success: true,
      data: {
        id: `location_${Date.now()}`,
        name,
        address,
        phone,
      },
      message: "Location added successfully",
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
