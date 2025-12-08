import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";

function Booking() {
  const navigate = useNavigate();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    // Încarcă pachetul selectat din localStorage
    const saved = localStorage.getItem("selectedPackage");
    if (saved) {
      const pkg = JSON.parse(saved);
      setSelectedPackage(pkg);
      fetchAvailableSlots();
    } else {
      alert("Te rugăm să selectezi mai întâi un pachet");
      window.location.href = "/#servicii";
    }
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("availability_slots")
        .select("*")
        .eq("is_booked", false)
        .gte("start_time", now)
        .order("start_time", { ascending: true });

      if (error) throw error;
      setAvailableSlots(data || []);
    } catch (error) {
      console.error("Error:", error);
      alert("Eroare la încărcarea slot-urilor disponibile");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    // Validări
    if (!selectedSlot) {
      alert("⚠️ Te rugăm să selectezi o dată și oră!");
      return;
    }

    if (!clientInfo.name || !clientInfo.email) {
      alert("⚠️ Te rugăm să completezi numele și email-ul!");
      return;
    }

    setBookingLoading(true);

    try {
      // 1. Creează order cu status 'pending'
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            package_id: selectedPackage.id,
            package_name: selectedPackage.name,
            amount: selectedPackage.price,
            status: "pending",
            payment_status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      console.log("✅ Order created:", order.id);

      // 2. Creează booking temporar (pre-rezervare)
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert([
          {
            order_id: order.id,
            slot_id: selectedSlot.id,
            client_name: clientInfo.name,
            client_email: clientInfo.email,
            client_phone: clientInfo.phone || null,
            notes: clientInfo.notes || null,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (bookingError) throw bookingError;

      console.log("✅ Booking created:", booking.id);

      // 3. Marcăm slot-ul ca pre-rezervat
      const { error: updateError } = await supabase
        .from("availability_slots")
        .update({ is_booked: true })
        .eq("id", selectedSlot.id);

      if (updateError) throw updateError;

      console.log("✅ Slot marked as booked");

      // 4. Creează Stripe checkout session
      const response = await fetch(
        "https://sgmbuwgtfyefupdyoehw.supabase.co/functions/v1/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packageName: selectedPackage.name,
            packageDescription: selectedPackage.description,
            amount: selectedPackage.price,
            orderId: order.id,
          }),
        }
      );

      const data = await response.json();

      if (!data.url) {
        throw new Error("Nu s-a putut crea sesiunea de plată");
      }

      console.log("✅ Stripe session created, redirecting...");

      // 5. Salvează order_id în localStorage (backup)
      localStorage.setItem("pendingOrderId", order.id);

      // 6. Redirect la Stripe pentru plată
      window.location.href = data.url;
    } catch (error) {
      console.error("❌ Error:", error);
      alert("❌ Eroare: " + error.message);
      setBookingLoading(false);
    }
  };
  const groupSlotsByDate = () => {
    const grouped = {};

    availableSlots.forEach((slot) => {
      const date = new Date(slot.start_time).toLocaleDateString("ro-RO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-orange-50">
        <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const groupedSlots = groupSlotsByDate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
            📅 Programează Consultația
          </h1>
          <p className="text-gray-600 text-lg">
            Alege data, ora și completează datele tale
          </p>
        </motion.div>

        {/* Package Info */}
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-pink-100"
          >
            <h3 className="font-bold text-gray-800 mb-2">Pachet Selectat:</h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              {selectedPackage.name}
            </p>
            <p className="text-gray-600 mt-2">Preț: £{selectedPackage.price}</p>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-800">
                📅 Alege Data & Ora
              </h3>
            </div>

            {Object.keys(groupedSlots).length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-500">
                  Nu există slot-uri disponibile momentan
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Te rugăm să contactezi Marina direct
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                {Object.entries(groupedSlots).map(([date, slots]) => (
                  <div key={date} className="space-y-3">
                    <h4 className="font-semibold text-gray-700 sticky top-0 bg-white py-2 border-b border-gray-200">
                      {date}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {slots.map((slot) => (
                        <motion.button
                          key={slot.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-xl font-medium transition-all border-2 ${
                            selectedSlot?.id === slot.id
                              ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white border-pink-500 shadow-lg"
                              : "bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50"
                          }`}
                        >
                          🕐{" "}
                          {new Date(slot.start_time).toLocaleTimeString(
                            "ro-RO",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Client Info Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-800">
                📝 Datele Tale
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nume Complet *
                </label>
                <input
                  type="text"
                  value={clientInfo.name}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="ex: Maria Popescu"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="ex: maria@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon (opțional)
                </label>
                <input
                  type="tel"
                  value={clientInfo.phone}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="ex: 0712 345 678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notițe / Întrebări (opțional)
                </label>
                <textarea
                  value={clientInfo.notes}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Orice informații relevante pentru consultație..."
                />
              </div>

              {/* Selected Slot Summary */}
              {selectedSlot && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border-2 border-green-200 rounded-xl"
                >
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Slot selectat:
                  </p>
                  <p className="font-bold text-gray-800">
                    📅{" "}
                    {new Date(selectedSlot.start_time).toLocaleString("ro-RO", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </motion.div>
              )}

              {/* Payment Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToPayment}
                disabled={bookingLoading || !selectedSlot}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Se procesează...
                  </span>
                ) : (
                  "💳 Continuă la Plată"
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
