import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DMS App',
  description: 'Created by Rohit',
  generator: 'Rohit',
}

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
