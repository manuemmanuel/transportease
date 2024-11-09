'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Apple, Bus, Mail } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [activeTab, setActiveTab] = useState('login')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (activeTab === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          return
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error

        alert('Check your email for the confirmation link!')
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) throw error

        setShowLoadingOverlay(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative w-full max-w-md px-4 sm:px-0">
        <div className="absolute inset-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
          <div
            className="aspect-[1100/600] w-[36.125rem] bg-gradient-to-tr from-[#AAFF30] to-[#80ff00] opacity-20"
            style={{
              clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
            }}
          />
        </div>

        <Card className="w-full backdrop-blur-xl bg-gray-800/70 text-gray-100 shadow-2xl border border-gray-700/50 rounded-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
              <Bus className="text-[#AAFF30]" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#AAFF30] to-[#80ff00]">
                TransportEase
              </span>
            </CardTitle>
            <CardDescription className="text-center text-gray-300 text-sm">
              Your journey begins with a simple login
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="space-y-6"
            >
              <TabsList className="relative grid w-full grid-cols-2 bg-gray-700/30 p-1.5 rounded-xl overflow-hidden">
                <TabsTrigger 
                  value="login" 
                  className="relative z-20 px-4 py-2 -mt-0.5 transition-all duration-300 text-gray-400 data-[state=active]:text-gray-900 data-[state=active]:font-medium flex items-center justify-center rounded-xl"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="relative z-20 px-4 py-2 -mt-0.5 transition-all duration-300 text-gray-400 data-[state=active]:text-gray-900 data-[state=active]:font-medium flex items-center justify-center rounded-xl"
                >
                  Sign Up
                </TabsTrigger>
                <div 
                  className="absolute left-0 top-[6px] h-[calc(100%-12px)] w-[calc(50%-6px)] bg-[#AAFF30] transition-transform duration-300 ease-out rounded-xl"
                  style={{
                    transform: `translateX(${activeTab === 'login' ? '6px' : 'calc(100% + 6px)'})`
                  }}
                />
              </TabsList>
              <TabsContent value="login" className="space-y-5">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-200 text-sm font-medium px-1">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="m@example.com" 
                        required 
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-gray-700/50 backdrop-blur-sm text-gray-100 border-gray-600 focus:border-[#AAFF30] focus:ring-[#AAFF30]/10 transition-all duration-300 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-200 px-1">Password</Label>
                      <Input 
                        id="password" 
                        name="password"
                        type="password" 
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-gray-700/50 backdrop-blur-sm text-gray-100 border-gray-600 focus:border-[#AAFF30] focus:ring-[#AAFF30]/10 transition-all duration-300 rounded-xl"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-[#AAFF30] text-gray-900 hover:bg-[#99ee20] hover:text-gray-900 transition-colors duration-300 rounded-xl"
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Login'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail" className="text-gray-200 px-1">Email</Label>
                      <Input 
                        id="signupEmail" 
                        name="email"
                        type="email" 
                        placeholder="m@example.com" 
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-gray-700/50 backdrop-blur-sm text-gray-100 border-gray-600 focus:border-[#AAFF30] focus:ring-[#AAFF30]/10 transition-all duration-300 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword" className="text-gray-200 px-1">Password</Label>
                      <Input 
                        id="signupPassword" 
                        name="password"
                        type="password" 
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-gray-700/50 backdrop-blur-sm text-gray-100 border-gray-600 focus:border-[#AAFF30] focus:ring-[#AAFF30]/10 transition-all duration-300 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-200 px-1">Confirm Password</Label>
                      <Input 
                        id="confirmPassword" 
                        name="confirmPassword"
                        type="password" 
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="bg-gray-700/50 backdrop-blur-sm text-gray-100 border-gray-600 focus:border-[#AAFF30] focus:ring-[#AAFF30]/10 transition-all duration-300 rounded-xl"
                      />
                    </div>
                    {error && <p className="text-sm text-red-400 px-1">{error}</p>}
                    <Button 
                      type="submit" 
                      className="w-full bg-[#AAFF30] text-gray-900 hover:bg-[#99ee20] hover:text-gray-900 transition-colors duration-300 rounded-xl"
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Create Account'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col space-y-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800/70 backdrop-blur-sm px-2 text-[#AAFF30]">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <Button 
                variant="outline" 
                className="bg-gray-700/50 backdrop-blur-sm text-[#AAFF30] border-[#AAFF30]/30 hover:bg-[#AAFF30] hover:text-gray-900 transition-all duration-300 rounded-xl"
                onClick={() => handleSocialLogin('google')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button 
                variant="outline" 
                className="bg-gray-700/50 backdrop-blur-sm text-[#AAFF30] border-[#AAFF30]/30 hover:bg-[#AAFF30] hover:text-gray-900 transition-all duration-300 rounded-xl"
                onClick={() => handleSocialLogin('apple')}
              >
                <Apple className="mr-2 h-4 w-4" />
                Apple
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      {showLoadingOverlay && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#AAFF30] border-t-transparent"></div>
            <p className="text-gray-100">Logging you in...</p>
          </div>
        </div>
      )}
    </div>
  )
}