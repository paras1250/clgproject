import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppHeader from '@/components/AppHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { adminAPI } from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner';
import { showToast } from '@/components/Toast';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (window.confirm(`Are you absolutely sure you want to delete user ${name}? This will delete all their bots and chat history forever.`)) {
      try {
        await adminAPI.deleteUser(id);
        showToast("User deleted successfully", "success");
        setUsers(users.filter(u => u._id !== id && u.id !== id));
      } catch (error: any) {
        showToast(error.response?.data?.error || "Failed to delete user", "error");
      }
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading Users..." />;

  return (
    <>
      <Head>
        <title>Manage Users - Admin</title>
      </Head>
      <div className="min-h-screen bg-[#0A0F1C] font-sans">
        <AppHeader title="Admin Panel" breadcrumb="Admin / Users" />
        
        <div className="flex">
          <AdminSidebar />
          
          <main className="flex-1 p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold font-sora text-white">User Management</h1>
            </div>
            
            <div className="bg-[#121826] rounded-2xl border border-white/[0.06] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#94A3B8]">
                  <thead className="text-xs uppercase bg-white/[0.02] border-b border-white/[0.06] text-[#F1F5F9]">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Joined</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-[#64748B]">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user._id || user.id} className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-medium text-white">
                            {user.name}
                          </td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'admin' 
                                ? 'bg-purple-500/10 text-purple-400' 
                                : 'bg-blue-500/10 text-blue-400'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {new Date(user.created_at || user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {user.role !== 'admin' && (
                              <button 
                                onClick={() => handleDeleteUser(user._id || user.id, user.name)}
                                className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors"
                              >
                                Delete
                              </button>
                            )}
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
