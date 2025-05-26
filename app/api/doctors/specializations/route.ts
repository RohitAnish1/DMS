import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const specializations = [
      "Anesthesiology",
      "Cardiology",
      "Dermatology",
      "Emergency Medicine",
      "Endocrinology",
      "Family Medicine",
      "Gastroenterology",
      "General Surgery",
      "Hematology",
      "Infectious Disease",
      "Internal Medicine",
      "Nephrology",
      "Neurology",
      "Neurosurgery",
      "Obstetrics and Gynecology",
      "Oncology",
      "Ophthalmology",
      "Orthopedics",
      "Otolaryngology",
      "Pathology",
      "Pediatrics",
      "Plastic Surgery",
      "Psychiatry",
      "Pulmonology",
      "Radiology",
      "Rheumatology",
      "Urology",
    ]

    return NextResponse.json({
      success: true,
      data: specializations,
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
