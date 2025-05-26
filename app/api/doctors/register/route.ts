import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName, phone, medicalRegistrationNumber } = body

    // Validate required fields
    if (!email || !password || !fullName || !phone || !medicalRegistrationNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
          errors: {
            email: !email ? ["Email is required"] : [],
            password: !password ? ["Password is required"] : [],
            fullName: !fullName ? ["Full name is required"] : [],
            phone: !phone ? ["Phone is required"] : [],
            medicalRegistrationNumber: !medicalRegistrationNumber ? ["Medical registration number is required"] : [],
          },
        },
        { status: 400 },
      )
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate email already exists error (for demo)
    if (email === "existing@example.com") {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
          errors: {
            email: ["This email is already registered"],
          },
        },
        { status: 409 },
      )
    }

    // Simulate successful registration
    return NextResponse.json({
      success: true,
      data: {
        id: "doctor_123",
        email,
        fullName,
        phone,
        medicalRegistrationNumber,
      },
      message: "Registration successful",
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
