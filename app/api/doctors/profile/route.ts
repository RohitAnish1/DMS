import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const specialization = formData.get("specialization") as string
    const yearsOfExperience = Number.parseInt(formData.get("yearsOfExperience") as string)
    const clinicName = formData.get("clinicName") as string
    const address = formData.get("address") as string
    const profilePhoto = formData.get("profilePhoto") as File

    // Validate required fields
    if (!specialization || !yearsOfExperience || !clinicName || !address) {
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
      photoUrl = `/uploads/profile-photos/doctor_123.jpg`
    }

    // Simulate successful profile setup
    return NextResponse.json({
      success: true,
      data: {
        specialization,
        yearsOfExperience,
        clinicName,
        address,
        profilePhoto: photoUrl,
      },
      message: "Profile setup successful",
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
