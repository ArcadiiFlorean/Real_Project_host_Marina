import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

function AdminCalendar() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);

  // Slot-uri pre-definite (ore standard)
  const timeSlots = [
    { start: '09:00', end: '10:00', label: '09:00 - 10:00' },
    { start: '10:00', end: '11:00', label: '10:00 - 11:00' },
    { start: '11:00', end: '12:00', label: '11:00 - 12:00' },
    { start: '12:00', end: '13:00', label: '12:00 - 13:00' },
    { start: '14:00', end: '15:00', label: '14:00 - 15:00' },
    { start: '15:00', end: '16:00', label: '15:00 - 16:00' },
    { start: '16:00', end: '17:00', label: '16:00 - 17:00' },
    { start: '17:00', end: '18:00', label: '17:00 - 18:00' },
  ];

  useEffect(() => {
    fetchSlots();
    fetchBookings();
  }, []);

  const fetchSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('availability_slots')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          slot:availability_slots(*),
          order:orders(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleTimeSlot = (timeSlot) => {
    const slotKey = `${timeSlot.start}-${timeSlot.end}`;
    
    if (selectedTimes.includes(slotKey)) {
      setSelectedTimes(selectedTimes.filter(t => t !== slotKey));
    } else {
      setSelectedTimes([...selectedTimes, slotKey]);
    }
  };

  const handleQuickAddSlots = async () => {
    if (!selectedDate) {
      alert('⚠️ Selectează o dată!');
      return;
    }

    if (selectedTimes.length === 0) {
      alert('⚠️ Selectează cel puțin un interval orar!');
      return;
    }

    setLoading(true);

    try {
      const slotsToAdd = selectedTimes.map(timeKey => {
        const [start, end] = timeKey.split('-');
        const startDateTime = new Date(`${selectedDate}T${start}`);
        const endDateTime = new Date(`${selectedDate}T${end}`);
        
        return {
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString()
        };
      });

      const { error } = await supabase
        .from('availability_slots')
        .insert(slotsToAdd);

      if (error) throw error;

      alert(`✅ ${selectedTimes.length} slot-uri adăugate cu succes!`);
      setSelectedTimes([]);
      setSelectedDate('');
      fetchSlots();
    } catch (error) {
      alert('❌ Eroare: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!confirm('Sigur vrei să ștergi acest slot?')) return;

    try {
      const { error } = await supabase
        .from('availability_slots')
        .delete()
        .eq('id', slotId);

      if (error) throw error;
      alert('✅ Slot șters!');
      fetchSlots();
    } catch (error) {
      alert('❌ Eroare: ' + error.message);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('ro-RO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUpcomingSlots = () => {
    const now = new Date();
    return slots.filter(slot => new Date(slot.start_time) > now);
  };

  // Verifică dacă un slot există deja pentru data selectată
  const isSlotAlreadyAdded = (timeSlot) => {
    if (!selectedDate) return false;
    
    const startDateTime = new Date(`${selectedDate}T${timeSlot.start}`);
    
    return slots.some(slot => {
      const slotStart = new Date(slot.start_time);
      return slotStart.getTime() === startDateTime.getTime();
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
          📅 Gestionare Calendar
        </h2>
        <p className="text-gray-600">Adaugă rapid slot-uri disponibile pentru consultații</p>
      </div>

      {/* Quick Add Section */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></div>
          <h3 className="text-2xl font-bold text-gray-800">⚡ Adaugă Slot-uri Rapid</h3>
        </div>

        {/* Date Picker */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Pasul 1: Alege Data
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all text-lg font-medium"
          />
        </div>

        {/* Time Slots Selection */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Pasul 2: Alege Intervalele Orare
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {timeSlots.map((timeSlot) => {
                const slotKey = `${timeSlot.start}-${timeSlot.end}`;
                const isSelected = selectedTimes.includes(slotKey);
                const alreadyExists = isSlotAlreadyAdded(timeSlot);

                return (
                  <motion.button
                    key={slotKey}
                    whileHover={{ scale: alreadyExists ? 1 : 1.02 }}
                    whileTap={{ scale: alreadyExists ? 1 : 0.98 }}
                    onClick={() => !alreadyExists && toggleTimeSlot(timeSlot)}
                    disabled={alreadyExists}
                    className={`p-4 rounded-xl font-medium transition-all border-2 ${
                      alreadyExists
                        ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white border-pink-500 shadow-lg'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg">{timeSlot.label}</div>
                      {alreadyExists && (
                        <div className="text-xs mt-1">✓ Deja adăugat</div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {selectedTimes.length > 0 && (
              <p className="text-sm text-pink-600 mt-3 font-medium">
                ✓ {selectedTimes.length} slot-uri selectate
              </p>
            )}
          </motion.div>
        )}

        {/* Add Button */}
        {selectedDate && selectedTimes.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleQuickAddSlots}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Se adaugă...
              </span>
            ) : (
              <span>✓ Adaugă {selectedTimes.length} Slot-uri</span>
            )}
          </motion.button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Available Slots */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-800">Slot-uri Viitoare</h3>
          </div>
          
          {getUpcomingSlots().length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-500 font-medium">Nu există slot-uri disponibile</p>
              <p className="text-gray-400 text-sm mt-2">Adaugă primul slot folosind formularul de mai sus!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {getUpcomingSlots().map((slot) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    slot.is_booked 
                      ? 'bg-gray-50 border-gray-300' 
                      : 'bg-green-50 border-green-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {new Date(slot.start_time).toLocaleDateString('ro-RO', { 
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        🕐 {new Date(slot.start_time).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })} 
                        {' → '}
                        {new Date(slot.end_time).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <span className={`inline-block text-xs px-3 py-1 rounded-full mt-2 font-medium ${
                        slot.is_booked 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {slot.is_booked ? '🔴 Rezervat' : '🟢 Disponibil'}
                      </span>
                    </div>
                    {!slot.is_booked && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-md"
                      >
                        🗑️
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-800">Programări Recente</h3>
          </div>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 font-medium">Nu există programări încă</p>
              <p className="text-gray-400 text-sm mt-2">Programările vor apărea aici când clienții rezervă</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {bookings.slice(0, 15).map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {booking.client_name || 'Client'}
                      </p>
                      <p className="text-sm text-gray-600">{booking.client_email}</p>
                      {booking.client_phone && (
                        <p className="text-sm text-gray-600">📱 {booking.client_phone}</p>
                      )}
                      {booking.slot && (
                        <p className="text-sm text-gray-600 mt-2">
                          📅 {formatDate(booking.slot.start_time)}
                        </p>
                      )}
                      {booking.notes && (
                        <p className="text-xs text-gray-500 mt-2 italic bg-white p-2 rounded-lg">
                          💬 {booking.notes}
                        </p>
                      )}
                      <span className="inline-block text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 mt-2 font-medium">
                        ✓ Confirmat
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCalendar;