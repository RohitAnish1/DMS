// Main Landing Page Component for the DMS (Doctor Management System)
// This is the homepage that displays the application's features and provides navigation to different user types

"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Star, ArrowRight, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function HomePage() {
  const router = useRouter()

  // Core features of the DMS application displayed on the landing page
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered appointment scheduling that optimizes your calendar automatically",
    },
    {
      icon: Users,
      title: "Patient Management",
      description: "Comprehensive patient records and communication tools in one place",
    },
    {
      icon: MapPin,
      title: "Multi-Location Support",
      description: "Manage appointments across multiple practice locations seamlessly",
    },
    {
      icon: Clock,
      title: "Flexible Availability",
      description: "Set complex schedules, exceptions, and availability rules with ease",
    },
  ]

  // Benefits/value propositions shown to potential users
  const benefits = [
    "Reduce no-shows by up to 40% with automated reminders",
    "Save 2+ hours daily on administrative tasks",
    "Increase patient satisfaction with easy online booking",
    "Streamline practice operations across multiple locations",
    "Real-time analytics and reporting dashboard",
    "HIPAA-compliant and secure patient data management",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation Header - Sticky header with branding and user access options */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo and Name */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Schedula</span>
            </div>
            
            {/* User Authentication and Registration Options */}
            <div className="flex items-center space-x-4">
              {/* Sign In Dropdown for different user types */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">Sign In</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/patient/login")}>Patient Login</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/doctor/login")}>Doctor Login</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Registration Dropdown for different user types */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>Get Started</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/patient/register")}>Join as Patient</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/onboarding")}>Join as Doctor</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Main promotional content and call-to-action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Trust Badge */}
          <Badge variant="secondary" className="mb-4">
            Trusted by 10,000+ Healthcare Professionals
          </Badge>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Streamline Your
            <span className="text-blue-600 block">Medical Practice</span>
          </h1>
          
          {/* Value Proposition */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Schedula is the all-in-one practice management platform that helps doctors manage appointments, patients,
            and availability, while providing patients with easy access to healthcare services.
          </p>
          
          {/* Primary Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/onboarding")} className="text-lg px-8 py-3">
              Onboard as Doctor
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/patient/register")}
              className="text-lg px-8 py-3"
            >
              Onboard as Patient
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          {/* Demo Button */}
          <div className="flex justify-center mt-4">
            <Button size="lg" variant="ghost" className="text-lg px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section - Showcases the core functionality of the DMS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Practice
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From appointment scheduling to patient management, Schedula provides all the tools you need in one
              integrated platform.
            </p>
          </div>

          {/* Feature Cards Grid - Displays key features with icons and descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  {/* Feature Icon */}
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Join Thousands of Doctors Who Trust Schedula
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform is designed specifically for healthcare professionals, with features that address the
                unique challenges of medical practice management.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dr. Sarah Johnson</h3>
                    <p className="text-gray-600">Cardiologist</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "Schedula has transformed how I manage my practice. The onboarding was seamless, and I was up and
                  running in minutes. My patients love the easy booking system!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Transform Your Practice?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of healthcare professionals who have streamlined their practice with Schedula. Get started
            with our simple onboarding process today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push("/onboarding")}
              className="text-lg px-8 py-3"
            >
              Start Doctor Onboarding
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/patient/register")}
              className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Start Patient Registration
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          <p className="text-blue-200 mt-4 text-sm">No credit card required • Setup in under 10 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Schedula</span>
              </div>
              <p className="text-gray-400">
                The modern practice management platform built for healthcare professionals.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Training
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Schedula. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
