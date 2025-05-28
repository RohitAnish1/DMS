import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate invalid credentials (for demo)
    if (email === "invalid@example.com" || password === "wrongpassword") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Simulate successful login
    return NextResponse.json({
      success: true,
      data: {
        token: "patient_jwt_token_123",
        patient: {
          id: "patient_123",
          fullName: "John Smith",
          email,
        },
      },
      message: "Login successful",
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
