'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface PaymentButtonProps {
  amount: number;
  bookingId: string;
  boardingPoint: string;
  droppingPoint: string;
  selectedSeats: string[];
  onSuccess: () => Promise<void>;
  onError?: (error: any) => void;
  className?: string;
}

export default function PaymentButton({ bookingId, amount, onSuccess, onError }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    try {
      setLoading(true)
      
      // Here you would typically integrate with a payment gateway
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update booking status to paid
      // This would typically be done on your backend after payment confirmation
      const response = await fetch(`/api/bookings/${bookingId}/pay`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Payment failed')
      }

      onSuccess?.()
    } catch (error) {
      console.error('Payment error:', error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-[#AAFF30] hover:bg-[#99ee20] text-gray-900 rounded-full py-6 px-8 font-bold text-lg shadow-lg hover:shadow-[#AAFF30]/20 transform hover:scale-105 transition-all duration-300"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing Payment...
        </>
      ) : (
        <>Pay ₹{amount}</>
      )}
    </Button>
  )
} 