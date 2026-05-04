
import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Search, Trash2, Mail, Calendar, ArrowUpRight, Copy, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';



export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");



  const navigate = useNavigate();




  const fetchSubscriptions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscription`);
      const data = await res.json();
      // Reverse once to get latest first
      const sortedData = data.slice().reverse();
      setSubscriptions(sortedData);
    } catch (err) {
      toast.error("Network synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this entry from the mailing list?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscription/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSubscriptions((prev) => prev.filter((item) => item._id !== id));
        toast.success("Subscriber removed");
      } else {
        toast.error("Action denied by server");
      }
    } catch {
      toast.error("Internal server error");
    }
  };

  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard");
  };

  const filtered = useMemo(() => {
    return subscriptions.filter((s) =>
      s.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, subscriptions]);



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
    fetchSubscriptions();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] p-6 lg:p-10 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[30%] bg-indigo-50/40 blur-[120px] rounded-full -z-10"  />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase flex items-center gap-4 text-black">
            <div className="w-3 h-10 bg-black rounded-full"  />
            Audience List
          </h1>
          <p className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-[0.2em]">
            {subscriptions.length} verified newsletter subscribers
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="bg-white border border-gray-100 px-6 py-4 rounded-2xl shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth Rate</p>
                <p className="text-xl font-black text-emerald-500">+14%</p>
            </div>
        </div>
      </div>

      {/* SEARCH INTERFACE */}
      <div className="relative w-full max-w-2xl mb-12 group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
            <Search size={20}  />
        </div>
        <input
          type="text"
          placeholder="FILTER EMAILS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-[2.5rem] pl-16 pr-8 py-6 text-xs font-black tracking-widest focus:ring-[12px] focus:ring-black/5 outline-none transition-all shadow-sm"
         />
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin"  />
          <p className="text-[10px] font-black text-gray-400 tracking-[0.3em]">FETCHING SUBSCRIBER DATA</p>
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
                  <th className="px-10 py-7 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Subscriber Identity</th>
                  <th className="px-10 py-7 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-7 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                  <th className="px-10 py-7 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode="popLayout">
                  {filtered.map((sub) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={sub._id} 
                      className="group hover:bg-gray-50/30 transition-colors"
                    >
                      {/* Email Identity */}
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
                            <Mail size={18}  />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-sm text-gray-800 tracking-tight">{sub.email}</span>
                            <button 
                                onClick={() => copyToClipboard(sub.email)}
                                className="text-[9px] font-black text-indigo-500 uppercase flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Copy size={10}  /> Copy to clipboard
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-10 py-6">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full">
                           <CheckCircle2 size={12}  />
                           <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="px-10 py-6">
                        <div className="flex flex-col gap-1 text-gray-400 font-bold">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                             <Calendar size={14} className="text-gray-300"  />
                             <span>{new Date(sub.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <span className="text-[10px] uppercase ml-5">at {new Date(sub.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button className="p-3 bg-gray-50 text-gray-400 hover:bg-black hover:text-white rounded-xl transition-all">
                            <ArrowUpRight size={18}  />
                          </button>
                          <button
                            onClick={() => handleDelete(sub._id)}
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
          
          {filtered.length === 0 && (
            <div className="py-24 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-gray-200"  />
                </div>
              <p className="text-gray-400 font-black text-xs tracking-widest italic uppercase">No matching subscribers found</p>
            </div>
          )}
        </motion.div>
      )}

      {/* FOOTER STATS */}
      <div className="mt-8 flex justify-center">
        <div className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl">
            Displaying {filtered.length} Entries
        </div>
      </div>
    </div>
  );
}