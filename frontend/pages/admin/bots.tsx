import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppHeader from '@/components/AppHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { adminAPI } from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminBots() {
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBots();
  }, [router]);

  const fetchBots = async () => {
    try {
      const data = await adminAPI.getBots();
      setBots(data.bots || []);
    } catch (error) {
      console.error("Failed to fetch bots", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading Bots..." />;

  return (
    <>
      <Head>
        <title>Manage Chatbots - Admin</title>
      </Head>
      <div className="min-h-screen bg-[#0A0F1C] font-sans">
        <AppHeader title="Admin Panel" breadcrumb="Admin / Chatbots" />
        
        <div className="flex">
          <AdminSidebar />
          
          <main className="flex-1 p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold font-sora text-white">Global Chatbots</h1>
            </div>
            
            <div className="bg-[#121826] rounded-2xl border border-white/[0.06] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#94A3B8]">
                  <thead className="text-xs uppercase bg-white/[0.02] border-b border-white/[0.06] text-[#F1F5F9]">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Bot Name</th>
                      <th className="px-6 py-4 font-semibold">Model</th>
                      <th className="px-6 py-4 font-semibold">Owner</th>
                      <th className="px-6 py-4 font-semibold">Created</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bots.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-[#64748B]">
                          No bots created yet.
                        </td>
                      </tr>
                    ) : (
                      bots.map((bot) => (
                        <tr key={bot._id || bot.id} className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-medium text-white">
                            {bot.name}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-1 rounded">
                              {bot.model_name || 'default'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {bot.user_id?.name || bot.user_id?.email || 'Unknown'}
                          </td>
                          <td className="px-6 py-4">
                            {new Date(bot.created_at || bot.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                             <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                              bot.is_active 
                                ? 'bg-[#00F5D4]/10 text-[#00F5D4]' 
                                : 'bg-[#EF4444]/10 text-[#EF4444]'
                            }`}>
                              {bot.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
