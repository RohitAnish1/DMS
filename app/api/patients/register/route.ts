import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, password, phone, dateOfBirth, gender, address } = body

    // Validate required fields
    if (!fullName || !email || !password || !phone || !dateOfBirth || !gender || !address) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
          errors: {
            fullName: !fullName ? ["Full name is required"] : [],
            email: !email ? ["Email is required"] : [],
            password: !password ? ["Password is required"] : [],
            phone: !phone ? ["Phone is required"] : [],
            dateOfBirth: !dateOfBirth ? ["Date of birth is required"] : [],
            gender: !gender ? ["Gender is required"] : [],
            address: !address ? ["Address is required"] : [],
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
        id: "patient_123",
        fullName,
        email,
        phone,
        dateOfBirth,
        gender,
        address,
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
