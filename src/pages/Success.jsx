import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

function Success() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          slot:availability_slots(*),
          order:orders(*)
        `)
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

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