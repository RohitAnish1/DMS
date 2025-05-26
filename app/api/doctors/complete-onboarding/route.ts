import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate successful onboarding completion
    return NextResponse.json({
      success: true,
      data: {
        status: "pending_verification",
        message: "Onboarding completed successfully. Your account is pending verification.",
      },
      message: "Onboarding completed successfully",
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
