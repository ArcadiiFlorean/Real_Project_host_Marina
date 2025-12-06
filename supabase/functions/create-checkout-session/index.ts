import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.0.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { packageId, packageName, packageDescription, packagePrice } = await req.json()

    // Initialize Supabase client - HARDCODED (anon key e safe să fie public)
    const supabaseClient = createClient(
      'https://sgmbuwgtfyefupdyoehw.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnbWJ1d2d0ZnllZnVwZHlvZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3ODk1MjAsImV4cCI6MjA4MDM2NTUyMH0.wdc5pKuyxukWWGCiAcyb_X7dc3K0-MHMaQReQ67tAZk',
    )

    const origin = req.headers.get('origin') || 'http://localhost:5176'

    console.log('Creating checkout session for:', packageName, packagePrice)

    // Creează Stripe Checkout Session
   const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'gbp',
            product_data: {
              name: packageName,
              description: packageDescription,
            },
            unit_amount: Math.round(packagePrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        package_id: packageId,
        package_name: packageName,
      },
    })

    console.log('Session created:', session.id)

    // Salvează comanda în Supabase (status: pending)
const { data: order, error: orderError } = await supabaseClient
  .from('orders')
  .insert({
    stripe_session_id: session.id,
    package_id: packageId || null,
    package_name: packageName,
    package_description: packageDescription,
    amount: packagePrice,
    currency: 'gbp',
        customer_email: 'pending@checkout.com', // Va fi actualizat după plată
        payment_status: 'pending',
        metadata: {
          session_url: session.url,
        },
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      // Nu oprim procesul dacă salvarea eșuează
    } else {
      console.log('Order created:', order.id)
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})