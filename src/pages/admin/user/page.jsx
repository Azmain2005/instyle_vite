import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2, Search, UserPlus, MoreHorizontal, ShieldCheck, Mail, Fingerprint, X, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // --- New States for Admin Creation ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminData, setAdminData] = useState({ email: "", password: "", role: "admin" });
  const [isSubmitting, setIsSubmitting] = useState(false);


  const navigate = useNavigate();

  const checkJWT = async () => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      navigate('/account/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      console.log(decoded.exp);
      console.log(currentTime);
      if (decoded.exp < currentTime) {
        localStorage.removeItem('auth_token');
        navigate('/account/login');
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      navigate('/account/login');
    }
  }


  useEffect(() => {
    checkJWT();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user`);
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
    } catch {
      toast.error("Delete operation failed");
    }
  };

  // --- Handle Admin Creation ---
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/admin`, adminData);
      toast.success("Admin created successfully");
      setIsModalOpen(false);
      setAdminData({ email: "", password: "" });
      fetchUsers(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] p-6 lg:p-10 relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-blue-50/50 blur-[120px] rounded-full -z-10"  />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase flex items-center gap-4 text-black">
            <div className="w-3 h-10 bg-black rounded-full"  />
            Identity Management
          </h1>
          <p className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-[0.2em]">
            Authentication & User Directory
          </p>
        </div>

        {/* Updated Button to open Modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-6 py-4 rounded-2xl font-black text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
        >
          <UserPlus size={16}  />
          CREATE ADMIN OPERATOR
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-full max-w-2xl mb-12 group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
          <Search size={20}  />
        </div>
        <input
          type="text"
          placeholder="FILTER BY IDENTITY OR EMAIL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-[2.5rem] pl-16 pr-8 py-6 text-xs font-black tracking-widest focus:ring-[12px] focus:ring-black/5 outline-none transition-all shadow-sm"
         />
      </div>

      {/* ADMIN CREATION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
             />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-gray-100"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black italic uppercase tracking-tighter">New Admin Privileges</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20}  />
                </button>
              </div>

              <form onSubmit={handleCreateAdmin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest ml-4 uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16}  />
                    <input
                      required
                      type="email"
                      placeholder="admin@system.com"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                      value={adminData.email}
                      onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                     />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest ml-4 uppercase">Secure Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16}  />
                    <input
                      required
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                      value={adminData.password}
                      onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                     />
                  </div>
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-black text-white py-5 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:shadow-xl hover:shadow-black/20 transition-all disabled:bg-gray-400"
                >
                  {isSubmitting ? "AUTHORIZING..." : "CONFIRM ADMIN CREATION"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TABLE SECTION (Remains the same as your original) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin"  />
          <p className="text-[10px] font-black text-gray-400 tracking-[0.3em]">QUERYING USER DATA</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-7 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Avatar & Name</th>
                  <th className="px-8 py-7 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                  <th className="px-8 py-7 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Google Identity</th>
                  <th className="px-8 py-7 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Privilege</th>
                  <th className="px-8 py-7 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      layout
                      key={user._id}
                      className="group hover:bg-gray-50/30 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100 group-hover:rotate-3 transition-transform duration-500">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name || "User"} fill className="object-cover"  />
                            ) : (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-black italic">
                                {user.name?.charAt(0) || "U"}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-black text-black text-sm uppercase tracking-tighter">{user.name || "System Admin"}</p>
                            <p className="text-gray-400 text-[10px] font-bold">CREATED: {new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-xs font-bold text-gray-600">
                        {user.email}
                      </td>

                      <td className="px-8 py-6">
                        {user.googleid ? (
                          <div className="inline-flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                            <Fingerprint size={14} className="text-blue-500"  />
                            <code className="text-[11px] font-black text-gray-600 tracking-tight">{user.googleid}</code>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 text-gray-300 italic">
                            <ShieldCheck size={14}  />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Internal Auth</span>
                          </div>
                        )}
                      </td>

                      <td className="px-8 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] transition-all`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-3 bg-rose-50 text-rose-500 hover:bg-black hover:text-white rounded-xl transition-all duration-300 group/del"
                          >
                            <Trash2 size={18} className="group-hover/del:scale-110"  />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}