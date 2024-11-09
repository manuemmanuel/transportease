"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bus, Car, Train, Star, CheckCircle, Menu } from "lucide-react"
import { useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function HomePage() {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const sections = document.querySelectorAll('.gradient-section');
      sections.forEach((section) => {
        const { clientX, clientY } = event;
        const { offsetLeft, offsetTop } = section as HTMLElement;
        const xPos = clientX - offsetLeft;
        const yPos = clientY - offsetTop;
        (section as HTMLElement).style.backgroundImage = `radial-gradient(circle at ${xPos}px ${yPos}px, #9AE62B, #080808)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/75 border-b border-gray-800/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold" style={{ color: '#AAFF30' }}>
            TransportEase
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            <Link href="/book" className="px-4 py-2 rounded-full hover:bg-gray-800/50 transition-all" style={{ color: '#9AE62B' }}>Book</Link>
            <Link href="/about" className="px-4 py-2 rounded-full hover:bg-gray-800/50 transition-all" style={{ color: '#9AE62B' }}>About</Link>
            <Link href="/contact" className="px-4 py-2 rounded-full hover:bg-gray-800/50 transition-all" style={{ color: '#9AE62B' }}>Contact</Link>
            <Link href="/account" className="px-4 py-2 rounded-full hover:bg-gray-800/50 transition-all" style={{ color: '#9AE62B' }}>Account</Link>
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" style={{ color: '#9AE62B' }} />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900 border-gray-800">
              <div className="flex flex-col space-y-4 mt-8">
                <Link 
                  href="/book" 
                  className="text-lg font-semibold transition-colors hover:text-[#AAFF30]" 
                  style={{ color: '#9AE62B' }}
                >
                  Book
                </Link>
                <Link 
                  href="/about" 
                  className="text-lg font-semibold transition-colors hover:text-[#AAFF30]" 
                  style={{ color: '#9AE62B' }}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="text-lg font-semibold transition-colors hover:text-[#AAFF30]" 
                  style={{ color: '#9AE62B' }}
                >
                  Contact
                </Link>
                <Link 
                  href="/account" 
                  className="text-lg font-semibold transition-colors hover:text-[#AAFF30]" 
                  style={{ color: '#9AE62B' }}
                >
                  Account
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="py-20 text-center bg-grid rounded-3xl mx-4 my-8 glass-effect"
        style={{
          color: '#FFFFFF',
        }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6" style={{ color: '#AAFF30' }}>Your Journey, Your Way</h1>
          <p className="text-xl mb-8" style={{ color: '#9AE62B' }}>Book any transportation with ease and convenience</p>
          <Button asChild size="lg" className="rounded-full hover:scale-105 transition-all" 
            style={{ backgroundColor: '#AAFF30', color: '#080808' }}>
            <Link href="/book">Book Now</Link>
          </Button>
        </div>
      </section>

      {/* Key Features */}
      <section
        className="py-16 relative bg-grid-small"
      >
        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#AAFF30' }}>Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <CheckCircle className="h-8 w-8 text-green-400" />, title: "Easy Booking", description: "Book your ride in just a few clicks" },
              { icon: <CheckCircle className="h-8 w-8 text-green-400" />, title: "Multiple Options", description: "Choose from various transportation modes" },
              { icon: <CheckCircle className="h-8 w-8 text-green-400" />, title: "24/7 Support", description: "Get assistance anytime, anywhere" },
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-800/30 backdrop-blur-sm border-gray-700/50 hover:scale-105 transition-all rounded-2xl hover:shadow-lg hover:shadow-[#AAFF30]/20">
                <CardContent className="flex flex-col items-center p-6">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                  <p className="text-center text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transportation Modes */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#AAFF30' }}>Supported Transportation Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
            {[
              { icon: <Bus className="h-12 w-12" />, name: "Bus" },
              { icon: <Car className="h-12 w-12" />, name: "Car" },
              { icon: <Train className="h-12 w-12" />, name: "Train" },
            ].map((mode, index) => (
              <div key={index} className="flex flex-col items-center bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl hover:scale-105 transition-all hover:shadow-lg hover:shadow-[#AAFF30]/20 border border-gray-700/50">
                {mode.icon}
                <span className="mt-2 text-lg" style={{ color: '#FFFFFF' }}>{mode.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="py-16 relative bg-dot"
      >
        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#AAFF30' }}>What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Alice Johnson", comment: "TransportEase made my city tour so convenient! Highly recommended." },
              { name: "Bob Smith", comment: "I love the variety of options. It's my go-to app for all my travel needs." },
              { name: "Carol Davis", comment: "The customer support is outstanding. They're always there to help!" },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/30 backdrop-blur-sm border-gray-700/50 hover:scale-105 transition-all rounded-2xl hover:shadow-lg hover:shadow-[#AAFF30]/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="mb-4 text-gray-300">"{testimonial.comment}"</p>
                  <p className="font-semibold" style={{ color: '#FFFFFF' }}>- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t rounded-t-3xl" style={{ backgroundColor: '#080808', borderColor: '#080808' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="text-2xl font-bold" style={{ color: '#AAFF30' }}>
                TransportEase
              </Link>
            </div>
            <div className="flex space-x-4">
              <Button asChild variant="outline" className="rounded-full hover:scale-105 transition-all" 
                style={{ borderColor: '#AAFF30', color: '#AAFF30' }}>
                <Link href="/book">Book Now</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full hover:scale-105 transition-all" 
                style={{ borderColor: '#AAFF30', color: '#AAFF30' }}>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 text-center" style={{ color: '#9AE62B' }}>
            © {new Date().getFullYear()} TransportEase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}