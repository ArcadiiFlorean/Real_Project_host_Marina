import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import AdminVideos from '../components/AdminVideos';
import AdminOrders from './AdminOrders';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-2xl">
                💝
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              
               <a href="/"
                className="px-4 py-2 text-gray-600 hover:text-pink-600 transition-colors"
              >
                🏠 Acasă
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
              activeTab === 'packages'
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            📦 Pachete Consultații
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            💰 Comenzi & Plăți
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            🎥 Videoclipuri
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'packages' && (
            <AdminDashboard user={user} onLogout={handleLogout} />
          )}
          
          {activeTab === 'orders' && (
            <AdminOrders />
          )}

          {activeTab === 'videos' && (
            <AdminVideos />
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;