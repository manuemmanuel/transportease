import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = {
  params: {
    id: string
  }
}

export async function POST(
<<<<<<< HEAD
    request: Request,
    context: { params: { id: string } }  
=======
  req: NextRequest,
  context: RouteParams
>>>>>>> 9113f71bd00b2ac38ac85c9dfbeb13ed3b3448f3
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Update booking status to paid
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'paid' })
      .eq('id', context.params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Payment failed' },
      { status: 500 }
    )
  }
} 
