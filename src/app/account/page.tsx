'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { ArrowLeft, Upload, CheckCircle2 } from 'lucide-react'

interface Profile {
  id: string
  full_name: string
  phone_number: string
  address: string
  created_at: string
  avatar_url?: string
}

export default function AccountPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isMounted, setIsMounted] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const form = useForm({
    defaultValues: {
      full_name: '',
      phone_number: '',
      address: '',
    },
  })

  useEffect(() => {
    setIsMounted(true)
    
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.push('/')
        return
      }

      setUser(session.user)
      
      // Fetch profile data
      try {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (!profileError && data) {
          setProfile(data)
          form.reset({
            full_name: data.full_name,
            phone_number: data.phone_number,
            address: data.address,
          })
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
      
      setLoading(false)
    }

    let mounted = true
    
    if (mounted) {
      getUser()
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return
        
        if (event === 'SIGNED_OUT') {
          router.push('/login')
        } else if (session) {
          setUser(session.user)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
      setIsMounted(false)
    }
  }, [supabase, router])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    setIsMounted(false)
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      if (isMounted) {
        setIsSigningOut(false)
      }
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${user?.id}/avatar.${fileExt}`

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })

      if (updateError) throw updateError

      // Refresh profile data
      const { data: newProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      setProfile(newProfile)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: any) => {
    if (!isMounted) return
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: data.full_name,
          phone_number: data.phone_number,
          address: data.address,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      if (isMounted) {
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single()

        setProfile(newProfile)
        setShowSuccess(true)
        const timeout = setTimeout(() => {
          if (isMounted) {
            setShowSuccess(false)
          }
        }, 3000)

        return () => clearTimeout(timeout)
      }
    } catch (error) {
      if (isMounted) {
        console.error('Error updating profile:', error)
        alert('Error updating profile')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-100">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-ranade p-4">
      <div className="w-full max-w-md">
        <Button 
          onClick={() => router.back()}
          variant="ghost" 
          className="mb-6 text-gray-100 hover:text-[#AAFF30] rounded-full px-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="bg-gray-800/50 text-gray-100 shadow-lg mb-4 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="px-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#AAFF30] to-green-400 bg-clip-text text-transparent">
              My Account
            </CardTitle>
            <CardDescription className="text-gray-300">
              {profile ? 'Update your profile information' : 'Complete your profile to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="relative group">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-2 border-[#AAFF30] transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#AAFF30]/20"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-700/50 flex items-center justify-center backdrop-blur-sm border border-gray-600/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#AAFF30]/20">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-[#AAFF30] p-3 rounded-full cursor-pointer hover:bg-[#99ee20] transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <Upload className="w-4 h-4 text-gray-900" />
                </label>
                <input type="file" id="avatar-upload" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
              </div>
              {uploading && <p className="text-sm text-gray-400">Uploading...</p>}
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-gray-700/30 backdrop-blur-sm border border-gray-600/50">
              <p className="text-gray-300 text-sm">Email:</p>
              <p className="font-medium">{user?.email}</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-gray-700/30 border-gray-600/50 text-gray-100 rounded-xl focus:border-[#AAFF30] focus:ring-[#AAFF30]/20 transition-all duration-300" 
                          placeholder="Enter your full name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-gray-700/30 border-gray-600/50 text-gray-100 rounded-xl focus:border-[#AAFF30] focus:ring-[#AAFF30]/20 transition-all duration-300" 
                          placeholder="Enter your phone number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Address</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-gray-700/30 border-gray-600/50 text-gray-100 rounded-xl focus:border-[#AAFF30] focus:ring-[#AAFF30]/20 transition-all duration-300" 
                          placeholder="Enter your address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit"
                    className="flex-1 bg-[#AAFF30] text-gray-900 hover:bg-[#99ee20] hover:text-gray-900 transition-all duration-300 rounded-full hover:scale-105"
                  >
                    {profile ? 'Update Profile' : 'Complete Profile'}
                  </Button>
                  <Button
                    onClick={handleSignOut}
                    variant="destructive"
                    className="flex-1 rounded-full hover:scale-105 transition-all duration-300"
                  >
                    Sign Out
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {showSuccess && (
          <Card className="bg-gray-800/50 text-gray-100 shadow-lg mt-4 border-[#AAFF30] border rounded-2xl backdrop-blur-sm animate-in slide-in-from-bottom duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-[#AAFF30]" />
                <p className="text-[#AAFF30]">Profile updated successfully!</p>
              </div>
            </CardContent>
          </Card>
        )}

        {isSigningOut && (
          <Card className="fixed inset-0 m-auto w-80 h-24 bg-gray-800/95 text-gray-100 shadow-2xl border border-gray-700/50 rounded-2xl backdrop-blur-sm animate-in zoom-in duration-300">
            <CardContent className="h-full flex items-center justify-center p-4">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-[#AAFF30] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#AAFF30]">Signing out...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}