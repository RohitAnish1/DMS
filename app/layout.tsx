// Main Root Layout Component for the DMS (Doctor Management System) Application
// This component wraps the entire application and provides the base HTML structure

import type { Metadata } from 'next'
import './globals.css'

// Application metadata configuration for SEO and browser display
export const metadata: Metadata = {
  title: 'DMS App',
  description: 'Created by Rohit',
  generator: 'Rohit',
}

// Root Layout Component that provides the HTML structure for all pages
// This is the top-level component that wraps all other components in the application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
