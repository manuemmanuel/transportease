'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 font-ranade p-4">
      <div className="container mx-auto py-8">
        {/* Back Button */}
        <Button 
          onClick={() => router.back()}
          variant="ghost" 
          className="mb-6 text-gray-100 hover:text-[#AAFF30] rounded-full px-6 hover:bg-gray-800/50 transition-all duration-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-12 bg-gray-800/50 p-8 rounded-3xl backdrop-blur-sm border border-gray-700/50 hover:border-[#AAFF30]/20 transition-all duration-300">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#AAFF30] to-green-400 bg-clip-text text-transparent">
            About Our Service
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Your trusted partner in modern transportation solutions. We connect passengers with reliable drivers for a seamless travel experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-800/50 border-gray-700/50 rounded-2xl hover:border-[#AAFF30]/20 transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-[#AAFF30] rounded-xl mb-4 flex items-center justify-center transform hover:scale-105 transition-all duration-300">
                <svg
                  className="h-6 w-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Service</h3>
              <p className="text-gray-300">
                Available round the clock to serve your transportation needs.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50 rounded-2xl hover:border-[#AAFF30]/20 transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-[#AAFF30] rounded-xl mb-4 flex items-center justify-center transform hover:scale-105 transition-all duration-300">
                <svg
                  className="h-6 w-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-300">
                Verified drivers and secure payment systems for your peace of mind.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50 rounded-2xl hover:border-[#AAFF30]/20 transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-[#AAFF30] rounded-xl mb-4 flex items-center justify-center transform hover:scale-105 transition-all duration-300">
                <svg
                  className="h-6 w-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Booking</h3>
              <p className="text-gray-300">
                Quick and easy booking process to get you moving in minutes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission Statement */}
        <Card className="bg-gray-800/50 border-gray-700/50 mb-12 rounded-3xl hover:border-[#AAFF30]/20 transition-all duration-300 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#AAFF30] to-green-400 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-gray-300 mb-8">
              To provide reliable, efficient, and sustainable transportation solutions that connect people and places. We strive to make every journey comfortable, safe, and environmentally conscious.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-700/30 p-4 rounded-2xl">
                <h4 className="text-[#AAFF30] text-2xl font-bold mb-2">1000+</h4>
                <p className="text-gray-300">Daily Rides</p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-2xl">
                <h4 className="text-[#AAFF30] text-2xl font-bold mb-2">500+</h4>
                <p className="text-gray-300">Verified Drivers</p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-2xl">
                <h4 className="text-[#AAFF30] text-2xl font-bold mb-2">4.8/5</h4>
                <p className="text-gray-300">User Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-gray-800/50 border-gray-700/50 rounded-3xl hover:border-[#AAFF30]/20 transition-all duration-300 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#AAFF30] to-green-400 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-700/30 p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3 text-gray-300">
                  <p className="flex items-center gap-2">
                    <span className="text-[#AAFF30]">Email:</span> 
                    support@transport.com
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#AAFF30]">Phone:</span> 
                    +1 (555) 123-4567
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#AAFF30]">Address:</span> 
                    123 Transport Street, City, Country
                  </p>
                </div>
              </div>
              <div className="bg-gray-700/30 p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-3 text-gray-300">
                  <p className="flex items-center gap-2">
                    <span className="text-[#AAFF30]">Mon - Fri:</span> 
                    9:00 AM - 6:00 PM
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#AAFF30]">Saturday:</span> 
                    10:00 AM - 4:00 PM
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#AAFF30]">Sunday:</span> 
                    Closed
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
