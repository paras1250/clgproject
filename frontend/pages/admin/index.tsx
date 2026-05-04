import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppHeader from '@/components/AppHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { adminAPI } from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Basic auth check before API call
    const userStr = Cookies.get('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
    } catch {
      router.push('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await adminAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
        // If 403 or 401, redirect to dashboard
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (loading) return <LoadingSpinner fullScreen text="Loading Admin Panel..." />;

  return (
    <>
      <Head>
        <title>Admin Dashboard - Conversio AI</title>
      </Head>
      <div className="min-h-screen bg-[#0A0F1C] font-sans">
        <AppHeader title="Admin Panel" breadcrumb="Admin / Overview" />
        
        <div className="flex">
          <AdminSidebar />
          
          <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold font-sora text-white mb-8">Platform Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stat Card 1 */}
              <div className="bg-[#121826] rounded-2xl p-6 border border-white/[0.06]">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-[#94A3B8] font-inter text-sm mb-1">Total Users</p>
                <h3 className="text-3xl font-bold text-white font-sora">{stats?.totalUsers || 0}</h3>
              </div>
              
              {/* Stat Card 2 */}
              <div className="bg-[#121826] rounded-2xl p-6 border border-white/[0.06]">
                <div className="w-12 h-12 bg-[#00F5D4]/10 rounded-xl flex items-center justify-center mb-4 text-[#00F5D4]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-[#94A3B8] font-inter text-sm mb-1">Total Chatbots</p>
                <h3 className="text-3xl font-bold text-white font-sora">{stats?.totalBots || 0}</h3>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-[#121826] rounded-2xl p-6 border border-white/[0.06]">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 text-purple-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-[#94A3B8] font-inter text-sm mb-1">Total Chat Sessions</p>
                <h3 className="text-3xl font-bold text-white font-sora">{stats?.totalChats || 0}</h3>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-[#121826] rounded-2xl p-6 border border-white/[0.06]">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 text-green-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p className="text-[#94A3B8] font-inter text-sm mb-1">New Bots (7 Days)</p>
                <h3 className="text-3xl font-bold text-white font-sora">+{stats?.newBotsLast7Days || 0}</h3>
              </div>
            </div>

            <div className="bg-[#121826] rounded-2xl p-8 border border-white/[0.06]">
              <h2 className="text-xl font-bold text-white mb-4">Welcome to the Admin Panel</h2>
              <p className="text-[#94A3B8] leading-relaxed max-w-3xl">
                As an administrator, you have full visibility into the Conversio AI platform. Use the sidebar to navigate to User Management to view or delete accounts, or Bot Management to oversee the AI agents deployed across your system.
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
