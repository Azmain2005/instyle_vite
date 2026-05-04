import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Megaphone, 
  Loader2,
  Clock
} from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();

  // Logic States
  const [bannerId, setBannerId] = useState(null);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // --- AUTH LOGIC ---
  const checkJWT = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/account/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem('auth_token');
        navigate('/account/login');
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      navigate('/account/login');
    }
  };

  // --- FETCH EXISTING BANNER ---
  const fetchBanner = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/promobanner`);
      if (res.data && res.data.length > 0) {
        setBannerId(res.data[0]._id);
        setText(res.data[0].text);
      }
    } catch (err) {
      console.error("Failed to fetch banner", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    checkJWT();
    fetchBanner();
  }, []);

  // --- SUBMIT LOGIC (CREATE OR UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("auth_token");
    
    try {
      if (bannerId) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/promobanner/${bannerId}`,
          { text },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage({ type: "success", text: "Banner updated successfully" });
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/promobanner`,
          { text },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage({ type: "success", text: res.data.message });
        fetchBanner(); 
      }
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || "Server side error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans w-full overflow-x-hidden">
      {/* Main container: No max-width, uses w-full to touch edges */}
      <main className="w-full p-4 md:p-8 lg:p-10">
        
        {/* Header - Full Width */}
        <header className="mb-6 md:mb-10 w-full">
          <h1 className="text-2xl md:text-3xl font-black text-black tracking-tight uppercase">Settings</h1>
          <p className="text-[10px] md:text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">General Configuration</p>
        </header>

        <div className="flex flex-col gap-6 md:gap-8 w-full">
          
          {/* Promo Banner Card - Forced to 100% width */}
          <section className="bg-white rounded-[24px] md:rounded-[32px] shadow-sm border border-gray-100 overflow-hidden w-full transition-all hover:shadow-md">
            <div className="p-6 md:p-8 border-b border-gray-50 flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-black text-white rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                <Megaphone size={20} className="md:w-6 md:h-6"  />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Promotion Banner</h2>
                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Top Website Alert Text</p>
              </div>
            </div>

            <div className="p-6 md:p-10 w-full">
              {fetching ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-gray-300" size={32}  />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                  <div className="space-y-3 w-full">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Banner Content</label>
                      {bannerId && (
                        <span className="text-[9px] font-bold bg-green-50 text-green-600 px-2 py-1 rounded-full flex items-center gap-1">
                          <Clock size={10}  /> ACTIVE SESSION
                        </span>
                      )}
                    </div>
                    <textarea
                      required
                      placeholder="E.G. GET 20% OFF ON ALL LUXURY PANJABIS THIS EID!"
                      className="w-full px-6 py-5 md:px-8 md:py-6 bg-gray-50 border-none rounded-2xl md:rounded-[24px] text-sm font-bold focus:ring-2 focus:ring-black transition-all outline-none min-h-[140px] md:min-h-[180px] resize-none"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                     />
                  </div>

                  {message && (
                    <div className={`p-5 md:p-6 rounded-[20px] md:rounded-[24px] flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                      <span className="text-[10px] md:text-xs font-black uppercase tracking-tight">{message.text}</span>
                    </div>
                  )}

                  <div className="flex justify-end w-full">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-auto flex items-center justify-center gap-3 bg-black text-white px-12 py-5 rounded-[20px] md:rounded-[24px] font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-800 disabled:bg-gray-200 transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18}  />
                      ) : (
                        <Save size={18}  />
                      )}
                      <span>{bannerId ? "Update Banner" : "Create Banner"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* Quick Info Box - Full Width */}
          <div className="p-6 md:p-8 bg-blue-50/50 rounded-[24px] md:rounded-[32px] border border-blue-100 flex items-start gap-4 w-full">
            <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={20}  />
            <p className="text-[10px] md:text-xs font-bold text-blue-600 leading-relaxed uppercase tracking-tight">
              Notice: You can only have one active promotion banner. 
              Submitting new text will automatically update the existing banner shown to your customers.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}