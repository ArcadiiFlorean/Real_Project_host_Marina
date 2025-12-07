import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import AdminVideos from '../components/AdminVideos';
import AdminOrders from './AdminOrders';
import AdminCalendar from '../components/AdminCalendar';

function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('packages');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-orange-50">
        <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50 border-b border-pink-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                💝
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              
              <a  href="/"
                className="px-4 py-2 text-gray-600 hover:text-pink-600 transition-colors font-medium"
              >
                🏠 Acasă
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-medium"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-6 py-3 rounded-2xl font-medium transition-all transform hover:scale-105 ${
              activeTab === 'packages'
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            📦 Pachete Consultații
          </button>
          
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-6 py-3 rounded-2xl font-medium transition-all transform hover:scale-105 ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            📅 Calendar & Programări
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-2xl font-medium transition-all transform hover:scale-105 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            💰 Comenzi & Plăți
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 rounded-2xl font-medium transition-all transform hover:scale-105 ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            🎥 Videoclipuri
          </button>
        </div>

        {/* Content Area */}
        <div>
          {activeTab === 'packages' && (
            <AdminDashboard user={user} onLogout={handleLogout} />
          )}
          
          {activeTab === 'calendar' && (
            <AdminCalendar />
          )}
          
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
              <AdminOrders />
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
              <AdminVideos />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;