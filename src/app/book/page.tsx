'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bus, Car, Train, MapPin, CreditCard, Wallet, Calendar, Clock, Users, Luggage, Map, Search, Crosshair, ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Vehicle {
  id: string;
  type: string;
  departureTime: string;
  price: number;
  availableSeats: number;
}

type TransportMode = 'Bus' | 'Train' | 'Car'

const transportModes = ['Bus', 'Train', 'Car']
const travelClasses = ['Economy', 'Business']
const ticketTypes = ['One-way', 'Round-trip']

interface TrainCompartment {
  id: string;
  name: string;
  seatLayout: string[][];
}

interface TransportOption {
  trip_id: number;
  departure_time: string;
  duration: string;
  arrival_time: string;
  boarding_point: string;
  cancellation_policy: string;
  dropping_point: string;
  service_type: string;
  fare: number;
  seats_left: number;
}

interface Booking {
  id?: number
  user_id: string
  trip_id: number
  selected_seats: string[]
  total_amount: number
  status: 'unpaid' | 'paid' | 'cancelled'
  created_at?: string
  boarding_point: string
  dropping_point: string
  passenger_count: number
  luggage_count: number
}

export default function BookingPage() {
  const [transportMode, setTransportMode] = useState<TransportMode>('Bus')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [travelClass, setTravelClass] = useState('Economy')
  const [ticketType, setTicketType] = useState('One-way')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [luggage, setLuggage] = useState(0)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [searchResults, setSearchResults] = useState<TransportOption[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [selectedCompartment, setSelectedCompartment] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<TransportOption | null>(null)
  const [showSeats, setShowSeats] = useState(false)
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<TransportOption | null>(null);
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false)

  const seatLayouts = {
    Bus: [
      ['A1', 'A2', '', 'A3', 'A4'],
      ['B1', 'B2', '', 'B3', 'B4'],
      ['C1', 'C2', '', 'C3', 'C4'],
      ['D1', 'D2', '', 'D3', 'D4'],
    ],
    Train: [
      ['A1', 'A2', 'A3', 'A4', '', 'A5', 'A6', 'A7', 'A8'],
      ['B1', 'B2', 'B3', 'B4', '', 'B5', 'B6', 'B7', 'B8'],
      ['C1', 'C2', 'C3', 'C4', '', 'C5', 'C6', 'C7', 'C8'],
    ],
    Car: [
      ['', 'Driver', ''],
      ['A1', '', 'A2'],
      ['B1', '', 'B2'],
    ],
  }

  const basePrices = {
    Bus: 20,
    Train: 30,
    Car: 50,
  }

  const trainCompartments: TrainCompartment[] = [
    {
      id: 'c1',
      name: 'Compartment 1',
      seatLayout: [
        ['A1', 'A2', 'A3', 'A4', '', 'A5', 'A6', 'A7', 'A8'],
        ['B1', 'B2', 'B3', 'B4', '', 'B5', 'B6', 'B7', 'B8'],
        ['C1', 'C2', 'C3', 'C4', '', 'C5', 'C6', 'C7', 'C8'],
      ]
    },
    {
      id: 'c2',
      name: 'Compartment 2',
      seatLayout: [
        ['D1', 'D2', 'D3', 'D4', '', 'D5', 'D6', 'D7', 'D8'],
        ['E1', 'E2', 'E3', 'E4', '', 'E5', 'E6', 'E7', 'E8'],
        ['F1', 'F2', 'F3', 'F4', '', 'F5', 'F6', 'F7', 'F8'],
      ]
    },
  ];

  useEffect(() => {
    if (!selectedOption) return;

    const seatPrices = selectedSeats.map(() => selectedOption.fare); // Use fare from selected option
    const seatsTotal = seatPrices.reduce((sum, price) => sum + price, 0);
    const luggagePrice = luggage * 5;
    setTotalPrice(seatsTotal + luggagePrice);
  }, [selectedOption, selectedSeats, luggage]);

  const handleSeatSelection = (seat: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seat)) {
        return prev.filter(s => s !== seat);
      }
      if (prev.length >= passengers) {
        return prev;
      }
      return [...prev, seat];
    });
  }

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchError(null);
    
    if (!origin || !destination || !departureDate) {
      setSearchError('Please fill in all required fields');
      setIsSearching(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('transport_options')
        .select('*')
        .ilike('boarding_point', `%${origin}%`)
        .ilike('dropping_point', `%${destination}%`)
        .gt('seats_left', 0)
        .order('departure_time', { ascending: true });

      if (error) throw error;

      const filteredData = data.filter(option => {
        const boardingMatches = option.boarding_point.toLowerCase().includes(origin.toLowerCase());
        const droppingMatches = option.dropping_point.toLowerCase().includes(destination.toLowerCase());
        return boardingMatches && droppingMatches;
      });

      if (filteredData.length === 0) {
        setSearchError('No transport options found for your search criteria');
      } else {
        setSearchResults(filteredData);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error instanceof Error ? error.message : 'Failed to search for transport options');
    } finally {
      setIsSearching(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=YOUR_API_KEY`
          );
          const data = await response.json();
          if (data.results?.[0]?.formatted) {
            setOrigin(data.results[0].formatted);
          }
        } catch (error) {
          console.error('Error getting location:', error);
          alert('Failed to get location name');
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Failed to get your location');
      }
    );
  };

  const renderSeats = () => {
    if (transportMode === 'Train') {
      return (
        <div className="space-y-6">
          {!selectedCompartment ? (
            // Render compartment selection view
            <div className="grid grid-cols-2 gap-4">
              {trainCompartments.map((compartment) => (
                <Button
                  key={compartment.id}
                  onClick={() => setSelectedCompartment(compartment.id)}
                  className="p-6 h-auto flex flex-col items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50"
                >
                  <div className="w-full aspect-[2/1] relative">
                    {/* Compartment visualization */}
                    <div className="absolute inset-0 border-2 border-current rounded-lg">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-2 bg-current" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-2 bg-current" />
                    </div>
                  </div>
                  <span className="text-sm font-medium">{compartment.name}</span>
                </Button>
              ))}
            </div>
          ) : (
            // Render seats for selected compartment
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {trainCompartments.find(c => c.id === selectedCompartment)?.name}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCompartment(null)}
                  className="text-sm"
                >
                  Change Compartment
                </Button>
              </div>
              
              <div className="relative">
                {/* Train car outline */}
                <div className="absolute inset-0 border-2 border-gray-600 rounded-lg -m-4" />
                
                {/* Seats layout */}
                <div className="relative z-10 p-6">
                  {trainCompartments
                    .find(c => c.id === selectedCompartment)
                    ?.seatLayout.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex justify-center gap-2 mb-4">
                        {row.map((seat, seatIndex) => (
                          <div key={`${rowIndex}-${seatIndex}`}>
                            {seat ? (
                              <Button
                                variant={selectedSeats.includes(seat) ? "default" : "outline"}
                                onClick={() => handleSeatSelection(seat)}
                                disabled={!selectedSeats.includes(seat) && selectedSeats.length >= passengers}
                                className={`w-12 h-12 p-0 ${
                                  selectedSeats.includes(seat)
                                    ? 'bg-[#AAFF30] hover:bg-[#99ee20] text-gray-900'
                                    : 'bg-gray-700/50 hover:bg-gray-600'
                                }`}
                              >
                                {seat}
                              </Button>
                            ) : (
                              <div className="w-12 h-12" /> // Aisle space
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-4 text-sm mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-700/50 border border-gray-600"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#AAFF30]"></div>
                  <span>Selected</span>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Return layout for Bus and Car (existing code)
    // ...
  };

  useEffect(() => {
    setSelectedCompartment(null);
  }, [transportMode]);

  const handleProceedToPayment = async () => {
    if (!user) {
      alert('Please log in to continue');
      return;
    }
    if (!selectedOption) {
      alert('Please select a transport option');
      return;
    }
    if (selectedSeats.length === 0) {
      alert('Please select your seats');
      return;
    }

    try {
      setShowPaymentOverlay(true); // Show overlay before processing
      console.log('Selected Option:', selectedOption);
      console.log('User:', user);
      console.log('Selected Seats:', selectedSeats);
      console.log('Total Price:', totalPrice);

      const bookingData: Booking = {
        user_id: user.id,
        trip_id: selectedOption.trip_id,
        selected_seats: selectedSeats,
        total_amount: totalPrice,
        status: 'unpaid',
        boarding_point: selectedOption.boarding_point,
        dropping_point: selectedOption.dropping_point,
        passenger_count: passengers,
        luggage_count: luggage
      };

      console.log('Booking Data:', bookingData);

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('Supabase Error:', error);
        throw error;
      }

      console.log('Created Booking:', booking);

      if (!booking?.id) {
        throw new Error('No booking ID returned');
      }

      setTimeout(() => {
        router.push(`/payment/${booking.id}`);
      }, 1000);
      
    } catch (error) {
      setShowPaymentOverlay(false); // Hide overlay on error
      console.error('Error creating booking:', error);
      if (error instanceof Error) {
        alert(`Failed to create booking: ${error.message}`);
      } else {
        alert('Failed to create booking. Please try again.');
      }
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      }
    })

    // Get initial user state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (!session?.user) {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Button
          variant="ghost"
          className="text-gray-300 hover:text-[#AAFF30] hover:bg-gray-800/50 rounded-full transition-all duration-300"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>

        <div className="mb-8 p-6 bg-gray-800/50 border border-gray-700/50 rounded-2xl backdrop-blur-sm hover:border-[#AAFF30]/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Welcome back</p>
              <p className="text-lg font-medium text-[#AAFF30]">{user?.email}</p>
            </div>
            <Link 
              href="/account" 
              className="text-sm text-[#AAFF30] hover:text-[#99ee20] transition-colors duration-200"
            >
              View Account
            </Link>
          </div>
        </div>

        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm rounded-3xl hover:border-[#AAFF30]/20 transition-all duration-300">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="origin" className="text-sm font-medium">Origin</Label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input 
                      id="origin" 
                      placeholder="Enter origin" 
                      value={origin} 
                      onChange={(e) => setOrigin(e.target.value)} 
                      className="pl-10 bg-gray-700/30 border-gray-600/50 rounded-xl focus:ring-[#AAFF30]/20 focus:border-[#AAFF30] transition-all duration-300" 
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-gray-700/30 border-gray-600/50 hover:border-[#AAFF30]/20 hover:bg-gray-700/50 transition-all duration-300 rounded-xl"
                    onClick={getCurrentLocation}
                  >
                    <Crosshair className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-sm font-medium">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input 
                    id="destination" 
                    placeholder="Enter destination" 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)} 
                    className="pl-10 bg-gray-700/30 border-gray-600/50 rounded-xl focus:ring-[#AAFF30]/20 focus:border-[#AAFF30] transition-all duration-300" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Transport Mode</Label>
                <Select onValueChange={(value: TransportMode) => setTransportMode(value)} defaultValue={transportMode}>
                  <SelectTrigger className="bg-gray-700/30 border-gray-600/50 rounded-xl hover:border-[#AAFF30]/20">
                    <SelectValue placeholder="Select transport" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 rounded-xl">
                    {transportModes.map(mode => (
                      <SelectItem 
                        key={mode} 
                        value={mode} 
                        className="text-white hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          {mode === 'Bus' && <Bus className="h-4 w-4" />}
                          {mode === 'Train' && <Train className="h-4 w-4" />}
                          {mode === 'Car' && <Car className="h-4 w-4" />}
                          {mode}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Departure Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input 
                    type="date" 
                    value={departureDate} 
                    onChange={(e) => setDepartureDate(e.target.value)} 
                    className="pl-10 bg-gray-700/30 border-gray-600/50 rounded-xl focus:ring-[#AAFF30]/20 focus:border-[#AAFF30] transition-all duration-300" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Number of Passengers</Label>
                <div className="flex items-center gap-4">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-xl bg-gray-700/30 border-gray-600/50 hover:border-[#AAFF30]/20 hover:bg-gray-700/50 transition-all duration-300"
                      onClick={() => {
                        const newCount = Math.max(1, passengers - 1);
                        setPassengers(newCount);
                        if (newCount < selectedSeats.length) {
                          setSelectedSeats([]);
                        }
                      }}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={passengers}
                      onChange={(e) => {
                        const newCount = Number(e.target.value);
                        setPassengers(newCount);
                        if (newCount < selectedSeats.length) {
                          setSelectedSeats([]);
                        }
                      }}
                      className="w-16 mx-2 text-center bg-gray-700/30 border-gray-600/50 rounded-xl focus:ring-[#AAFF30]/20 focus:border-[#AAFF30] transition-all duration-300"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-xl bg-gray-700/30 border-gray-600/50 hover:border-[#AAFF30]/20 hover:bg-gray-700/50 transition-all duration-300"
                      onClick={() => setPassengers(prev => Math.min(10, prev + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !origin || !destination || !departureDate}
                className="bg-[#AAFF30] hover:bg-[#99ee20] text-gray-900 rounded-full py-4 px-8 font-bold text-lg shadow-lg hover:shadow-[#AAFF30]/20 transform hover:scale-105 transition-all duration-300"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Options
              </Button>
            </div>

            <div className="mt-6">
              {isSearching && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AAFF30] mx-auto"></div>
                  <p className="mt-2 text-gray-400">Searching for options...</p>
                </div>
              )}

              {searchError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                  <p>{searchError}</p>
                </div>
              )}

              {!isSearching && !searchError && searchResults.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>No transport options found for your search criteria.</p>
                  <p className="text-sm mt-2">Try adjusting your search parameters.</p>
                </div>
              )}

              {!isSearching && !searchError && searchResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Available Options</h3>
                  <div className="grid gap-4">
                    {searchResults.map((option) => (
                      <Card 
                        key={option.trip_id} 
                        className={`
                          border-2 transition-all duration-200 cursor-pointer
                          ${selectedOption?.trip_id === option.trip_id 
                            ? 'bg-gray-600/50 border-[#AAFF30]' 
                            : 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50'
                          }
                        `}
                        onClick={() => {
                          setSelectedOption(option);
                          setShowSeats(true);
                          setSelectedVehicle(option);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Bus className="h-6 w-6" />
                              <div>
                                <div className="font-semibold flex items-center gap-2">
                                  {option.service_type}
                                  <span className="text-sm text-gray-400">(Trip #{option.trip_id})</span>
                                </div>
                                <div className="text-sm text-gray-300 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                      {option.departure_time} - {option.arrival_time}
                                      <span className="ml-2 text-gray-400">({option.duration})</span>
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{option.boarding_point} → {option.dropping_point}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[#AAFF30] text-xl">
                                ₹{option.fare}
                              </p>
                              <p className="text-sm text-gray-300">
                                {option.seats_left} seats available
                              </p>
                              <p className="text-xs text-gray-400">
                                {option.cancellation_policy} cancellation
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {showSeats && selectedOption && (
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm rounded-3xl hover:border-[#AAFF30]/20 transition-all duration-300">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Map className="h-6 w-6" />
                Select Your Seats from{' '}
                <span className="text-[#AAFF30]">{selectedOption.service_type}</span>
              </h2>
              <div className="grid grid-cols-5 gap-3 justify-center">
                {seatLayouts[transportMode].flat().map((seat, index) => (
                  seat ? (
                    <Button
                      key={index}
                      variant={selectedSeats.includes(seat) ? "default" : "outline"}
                      className={`rounded-xl w-14 h-14 transition-all duration-300 ${
                        selectedSeats.includes(seat)
                          ? 'bg-[#AAFF30] hover:bg-[#99ee20] text-gray-900 shadow-lg'
                          : 'bg-gray-700/30 hover:bg-gray-700/50 border-gray-600/50'
                      }`}
                      onClick={() => handleSeatSelection(seat)}
                      disabled={!selectedSeats.includes(seat) && selectedSeats.length >= passengers}
                    >
                      {seat}
                    </Button>
                  ) : (
                    <div key={index} className="w-14 h-14" />
                  )
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-700/30 rounded-2xl border border-gray-600/50">
                <div className="flex justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-700/50 border border-gray-600"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#AAFF30]"></div>
                    <span>Selected</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedOption && selectedSeats.length > 0 && (
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm rounded-3xl hover:border-[#AAFF30]/20 transition-all duration-300">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Booking Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Service Type:</span>
                  <span className="text-[#AAFF30]">{selectedOption.service_type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Seats:</span>
                  <span>{selectedSeats.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fare per seat:</span>
                  <span>₹{selectedOption.fare}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Seats Cost:</span>
                  <span>₹{selectedOption.fare * selectedSeats.length}</span>
                </div>
                {luggage > 0 && (
                  <div className="flex justify-between">
                    <span>Luggage Cost:</span>
                    <span>₹{luggage * 5}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-[#AAFF30]">₹{totalPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center pt-4">
          <Button 
            onClick={() => {
              console.log('Button clicked');
              handleProceedToPayment();
            }}
            className="bg-[#AAFF30] hover:bg-[#99ee20] text-gray-900 rounded-full py-4 px-8 font-bold text-lg shadow-lg hover:shadow-[#AAFF30]/20 transform hover:scale-105 transition-all duration-300 w-full md:w-auto"
          >
            Proceed to Payment
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
      {showPaymentOverlay && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#AAFF30] border-t-transparent"></div>
            <p className="text-gray-100">Processing your booking...</p>
          </div>
        </div>
      )}
    </div>
  )
}