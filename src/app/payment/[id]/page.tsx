'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import PaymentButton from '@/components/PaymentButton';
import { CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BookingDetails {
  id: number;
  trip_id: number;
  selected_seats: string[];
  total_amount: number;
  passenger_count: number;
  luggage_count: number;
  status: string;
  boarding_point: string;
  dropping_point: string;
  created_at: string;
  user_id: string;
}

interface PageProps {
    params: {
        id: string
    }
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function PaymentPage({
    params,
    searchParams,
}: PageProps) {
    const { id } = params;
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!id) {
                setError('No booking ID provided');
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching booking with ID:', id);
                
                const { data, error } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('id', parseInt(id))
                    .single();

                if (error) {
                    console.error('Supabase error:', error);
                    throw error;
                }
                
                console.log('Fetched data:', data);
                setBooking(data);
            } catch (err) {
                console.error('Error fetching booking:', err);
                setError('Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    const handlePaymentSuccess = async () => {
        try {
            // Update the booking status in Supabase
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'paid' })
                .eq('id', booking?.id);

            if (error) throw error;
            
            // Update local state
            setPaymentSuccess(true);
            
            // Update booking state with new status
            if (booking) {
                setBooking({ ...booking, status: 'paid' });
            }
        } catch (err) {
            console.error('Error updating booking status:', err);
        }
    };

    const downloadTicket = async () => {
        const ticket = document.getElementById('ticket');
        if (!ticket) return;

        try {
            const canvas = await html2canvas(ticket, {
                scale: 2,
                backgroundColor: '#1f2937', // Match your dark background
            });
            
            const pdf = new jsPDF({
                format: 'a4',
                unit: 'px',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`ticket-${booking?.id}.pdf`);
        } catch (err) {
            console.error('Error generating ticket:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AAFF30]"></div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-6">
                <div className="max-w-md mx-auto bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400">{error || 'Booking not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-6">
            <div className="max-w-2xl mx-auto">
                {!paymentSuccess ? (
                    <>
                        <h1 className="text-3xl font-bold mb-8 text-center text-[#AAFF30]">
                            Complete Your Payment
                        </h1>

                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold">Booking Summary</h2>
                                    <div className="grid gap-2">
                                        <div className="flex justify-between">
                                            <span>Booking ID:</span>
                                            <span className="text-[#AAFF30]">#{booking.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>From:</span>
                                            <span>{booking.boarding_point}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>To:</span>
                                            <span>{booking.dropping_point}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Selected Seats:</span>
                                            <span>{booking.selected_seats.join(', ')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Amount:</span>
                                            <span className="text-xl font-bold text-[#AAFF30]">
                                                ₹{booking.total_amount}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <PaymentButton 
                                            amount={booking.total_amount}
                                            bookingId={booking.id.toString()}
                                            boardingPoint={booking.boarding_point}
                                            droppingPoint={booking.dropping_point}
                                            selectedSeats={booking.selected_seats}
                                            onSuccess={handlePaymentSuccess}
                                            className="w-full bg-[#AAFF30] hover:bg-[#99ee20] text-gray-900 font-bold py-3 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <>
                        {/* Success Message */}
                        <div className="text-center mb-8 animate-in slide-in-from-top duration-500">
                            <CheckCircle2 className="w-16 h-16 text-[#AAFF30] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-[#AAFF30] mb-2">Payment Successful!</h2>
                            <p className="text-gray-300">Your ticket is ready for download</p>
                        </div>

                        {/* Ticket */}
                        <Card id="ticket" className="bg-gray-800/50 border-gray-700 mb-6 animate-in slide-in-from-bottom duration-500">
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-[#AAFF30]">TransportEase</h3>
                                        <span className="text-sm text-gray-400">#{booking?.id}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-400">From</p>
                                            <p className="font-semibold">{booking?.boarding_point}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">To</p>
                                            <p className="font-semibold">{booking?.dropping_point}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Seats</p>
                                            <p className="font-semibold">{booking?.selected_seats.join(', ')}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Amount Paid</p>
                                            <p className="font-semibold text-[#AAFF30]">₹{booking?.total_amount}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-700">
                                        <p className="text-sm text-gray-400">Booking Date</p>
                                        <p className="font-semibold">
                                            {new Date(booking?.created_at || '').toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Download Button */}
                        <Button
                            onClick={downloadTicket}
                            className="w-full bg-[#AAFF30] hover:bg-[#99ee20] text-gray-900 font-bold py-3 rounded-full flex items-center justify-center gap-2 animate-in slide-in-from-bottom duration-500 delay-200"
                        >
                            <Download className="w-4 h-4" />
                            Download Ticket
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}