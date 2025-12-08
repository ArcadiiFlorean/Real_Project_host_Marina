import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  if (!orderId) {
    setError('Order ID lipsește');
    setLoading(false);
    return;
  }

  console.log('🔍 Success page - Looking for order:', orderId); // ⭐ ADAUGĂ

  let attempts = 0;
  const maxAttempts = 30; // Mărește la 60 secunde

  const checkPaymentStatus = async () => {
    try {
      console.log(`🔍 Attempt ${attempts + 1} - Checking order:`, orderId); // ⭐ ADAUGĂ

      // Verifică statusul plății în orders
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*') // ⭐ Selectează TOT pentru debugging
        .eq('id', orderId)
        .single();

      if (orderError) {
        console.error('❌ Error fetching order:', orderError); // ⭐ ADAUGĂ
        throw orderError;
      }

      console.log(`📊 Attempt ${attempts + 1}: payment_status =`, order.payment_status, '| Full order:', order); // ⭐ MODIFICAT

      if (order.payment_status === 'paid') {
        console.log('✅ PAYMENT CONFIRMED! Loading booking details...'); // ⭐ ADAUGĂ

        // Plata confirmată! Încarcă detaliile booking-ului
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            *,
            slot:availability_slots(*),
            order:orders(*)
          `)
          .eq('order_id', orderId)
          .single();

        if (bookingError) throw bookingError;

        // Update booking status la 'confirmed'
        await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', bookingData.id);

        setBooking(bookingData);
        setPaymentConfirmed(true);
        setLoading(false);
        clearInterval(intervalId);
        
        // Curăță localStorage
        localStorage.removeItem('selectedPackage');
        localStorage.removeItem('pendingOrderId');
      }

      attempts++;
      if (attempts >= maxAttempts) {
        console.error('❌ TIMEOUT after', attempts, 'attempts'); // ⭐ ADAUGĂ
        clearInterval(intervalId);
        setError('Verificarea plății a expirat. Te rugăm să contactezi suportul.');
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Error checking payment:', err);
      setError(err.message);
      setLoading(false);
      clearInterval(intervalId);
    }
  };

  // Check imediat
  checkPaymentStatus();

  // Apoi check la fiecare 2 secunde
  const intervalId = setInterval(checkPaymentStatus, 2000);

  return () => clearInterval(intervalId);
}, [orderId]);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-orange-50 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
        >
          <div className="inline-block p-6 bg-red-100 rounded-full mb-6">
            <svg className="w-16 h-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            ❌ Eroare
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-2xl font-bold shadow-xl"
            >
              🏠 Înapoi la Site
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Loading / Waiting for payment confirmation
  if (loading || !paymentConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-orange-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Se verifică plata...
          </h2>
          <p className="text-gray-600 mb-2">
            Te rugăm să aștepți câteva secunde
          </p>
          <p className="text-sm text-gray-400">
            Nu închide această pagină
          </p>
        </motion.div>
      </div>
    );
  }

  // Success - Payment confirmed!
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block p-6 bg-green-100 rounded-full mb-6"
        >
          <svg className="w-16 h-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
          🎉 Programare Confirmată!
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Plata ta a fost procesată cu succes și consultația ta a fost programată.
        </p>

        {/* Booking Details */}
        {booking && (
          <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-bold text-gray-800 mb-4 text-center">📋 Detalii Programare</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Pachet:</span>
                <span className="font-semibold text-gray-800">{booking.order?.package_name}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Data & Ora:</span>
                <span className="font-semibold text-gray-800">
                  {new Date(booking.slot?.start_time).toLocaleString('ro-RO', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Nume:</span>
                <span className="font-semibold text-gray-800">{booking.client_name}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold text-gray-800">{booking.client_email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-bold text-gray-800 mb-3">📧 Ce urmează?</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Vei primi un email de confirmare la adresa ta</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Marina te va contacta cu 24h înainte de consultație</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Vei primi link-ul pentru consultația online</span>
            </li>
          </ul>
        </div>

        {/* Back to Home */}
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            🏠 Înapoi la Site
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

export default Success;