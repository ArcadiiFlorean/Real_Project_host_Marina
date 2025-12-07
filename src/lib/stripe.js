import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createCheckoutSession = async (packageData) => {
  try {
    const stripe = await stripePromise;

    console.log('📦 Creating order with data:', packageData);

    const orderData = {
      package_id: packageData.id,
      package_name: packageData.name,
      amount: packageData.price
    };

    console.log('💾 Sending to Supabase:', orderData);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('❌ Order error:', orderError);
      alert(`Eroare la creare comandă: ${orderError.message}`);
      throw orderError;
    }

    console.log('✅ Order created successfully:', order);

    const edgeFunctionPayload = {
      packageName: packageData.name,
      packageDescription: packageData.description,
      amount: parseFloat(packageData.price),
      orderId: order.id
    };

    console.log('🚀 Sending to Edge Function:', edgeFunctionPayload);

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(edgeFunctionPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Checkout error:', errorText);
      throw new Error(`Failed to create checkout: ${errorText}`);
    }

    const session = await response.json();

    if (session.error) {
      throw new Error(session.error);
    }

    console.log('✅ Checkout session:', session);

    // Salvăm session ID
    const { error: updateError } = await supabase
      .from('orders')
      .update({ stripe_session_id: session.sessionId })
      .eq('id', order.id);

    if (updateError) {
      console.error('⚠️ Update error:', updateError);
    }

    // ⭐ METODA NOUĂ - Redirect direct cu URL-ul de la Stripe
    console.log('🔀 Redirecting to Stripe Checkout...');
    window.location.href = session.url;

  } catch (error) {
    console.error('❌ FINAL Error:', error);
    throw error;
  }
};