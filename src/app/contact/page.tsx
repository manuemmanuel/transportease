'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900/95 backdrop-blur-sm py-12 px-4 sm:px-6 lg:px-8">
      {/* Enhanced Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center px-4 py-2 rounded-xl 
                  bg-gray-800/30 backdrop-blur-sm border border-gray-700/50
                  text-gray-300 hover:text-[#AAFF30] 
                  shadow-lg shadow-[#AAFF30]/5 hover:shadow-[#AAFF30]/10
                  transition-all duration-300 
                  group hover:border-[#AAFF30]/20"
      >
        <svg 
          className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
          />
        </svg>
        Back
      </button>

      <div className="max-w-md mx-auto bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl shadow-[#AAFF30]/5 hover:shadow-[#AAFF30]/10 transition-all duration-300">
        <div className="px-8 py-8">
          <h2 className="text-2xl font-bold text-[#AAFF30] text-center mb-8 drop-shadow-[0_0_3px_rgba(170,255,48,0.3)]">
            Contact Us
          </h2>

          {/* Contact Information */}
          <div className="space-y-5">
            <div className="flex items-center group">
              <div className="p-3 rounded-xl bg-gray-800/50 group-hover:bg-gray-800/70 transition-all duration-300 
                            border border-gray-700/30 group-hover:border-[#AAFF30]/20">
                <svg className="h-5 w-5 text-[#AAFF30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="ml-4 text-gray-300 group-hover:text-[#AAFF30]/90 transition-colors duration-300">+1 (555) 123-4567</span>
            </div>
            
            <div className="flex items-center group">
              <div className="p-3 rounded-xl bg-gray-800/50 group-hover:bg-gray-800/70 transition-all duration-300
                            border border-gray-700/30 group-hover:border-[#AAFF30]/20">
                <svg className="h-5 w-5 text-[#AAFF30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="ml-4 text-gray-300 group-hover:text-[#AAFF30]/90 transition-colors duration-300">contact@example.com</span>
            </div>

            <div className="flex items-center group">
              <div className="p-3 rounded-xl bg-gray-800/50 group-hover:bg-gray-800/70 transition-all duration-300
                            border border-gray-700/30 group-hover:border-[#AAFF30]/20">
                <svg className="h-5 w-5 text-[#AAFF30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="ml-4 text-gray-300 group-hover:text-[#AAFF30]/90 transition-colors duration-300">123 Business Street, City, Country</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
