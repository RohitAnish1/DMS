import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simulate patient profile data
    return NextResponse.json({
      success: true,
      data: {
        id: "patient_123",
        fullName: "John Smith",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        dateOfBirth: "1990-05-15",
        gender: "male",
        address: "123 Main Street, Anytown, ST 12345",
        profilePhoto: "/placeholder.svg?height=150&width=150",
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

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const dateOfBirth = formData.get("dateOfBirth") as string
    const gender = formData.get("gender") as string
    const address = formData.get("address") as string
    const profilePhoto = formData.get("profilePhoto") as File

    // Validate required fields
    if (!fullName || !email || !phone || !dateOfBirth || !gender || !address) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be provided",
        },
        { status: 400 },
      )
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate profile photo upload
    let photoUrl = null
    if (profilePhoto) {
      // In a real app, you would upload to a storage service
      photoUrl = `/uploads/profile-photos/patient_123.jpg`
    }

    // Simulate successful profile update
    return NextResponse.json({
      success: true,
      data: {
        fullName,
        email,
        phone,
        dateOfBirth,
        gender,
        address,
        profilePhoto: photoUrl,
      },
      message: "Profile updated successfully",
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
