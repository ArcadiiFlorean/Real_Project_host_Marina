import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Initialize Stripe
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Creează Stripe Checkout Session
export const createCheckoutSession = async (packageData) => {
  try {
    console.log('Creating checkout session with:', packageData);

    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        packageId: packageData.id,
        packageName: packageData.name,
        packageDescription: packageData.description,
        packagePrice: packageData.price,
      },
    });

    console.log('Edge function response:', data, error);

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }

    // Redirect către URL-ul Stripe Checkout
    if (data && data.url) {
      console.log('Redirecting to Stripe Checkout:', data.url);
      window.location.href = data.url;
    } else {
      throw new Error('No checkout URL received from server');
    }

  } catch (error) {
    console.error('Error creating checkout session:', error);
    alert('Eroare la crearea sesiunii de plată: ' + error.message);
    throw error;
  }
};