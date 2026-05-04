
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Fingerprint, Loader2 } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'; 
import Swal from 'sweetalert2';


export default function LuxuryLogin() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Attempting login with:", loginData);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        // Set the Cookie (This allows Middleware to see it)
        // Set it to expire in 1 day, or match your JWT expiry
        Cookies.set('auth_token', data.access_token, { expires: 1, secure: true, sameSite: 'strict' });
        localStorage.setItem('auth_token', data.access_token);
        setIsAuthenticated(true);
        Swal.fire({
          title: 'Success!',
          text: 'Identity Verified',
          icon: 'success',
          timer: 2000
        });
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      } else {
        // alert(data.error || "Identity Verification Failed");
        Swal.fire({
        title: 'Error!',
        text: 'Identity Verification Failed.',
        icon: 'error',
        confirmButtonText: 'Cool'
      });
      }
    } catch (err) {
      alert("Too many attempt happen, please wait for 2 minutes.");
    }finally {
      setIsLoading(false); 
    }
  };

  

const checkExistingAuth = () => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // If token is still valid, redirect to dashboard
      if (decoded.exp > currentTime) {
        navigate('/admin/dashboard');
      } else {
        Cookies.remove('auth_token');
        // If it's expired, clean it up so it doesn't cause issues later
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      Cookies.remove('auth_token');
      // If token is malformed, clear it
      localStorage.removeItem('auth_token');
    }
  }
};


  useEffect(() =>{
    checkExistingAuth();
  },[])


  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <Fingerprint className="text-white" size={40}  />
          </div>
          <h2 className="text-2xl font-black uppercase italic">Identity Verified</h2>
          <p className="text-gray-400 text-[10px] tracking-widest mt-2">REDIRECTING TO SECURE TERMINAL...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 relative overflow-hidden">
      <Toaster position="top-center"  />
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"  />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[500px]"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
            <Fingerprint className="text-white" size={28} strokeWidth={1.5}  />
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-black">
            Login Access
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="h-[1px] w-8 bg-gray-200"  />
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em]">
              Secure Terminal
            </span>
            <div className="h-[1px] w-8 bg-gray-200"  />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[3rem] p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
          <form onSubmit={handleLogin} className="space-y-8">
            {/* Email Input */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                Administrator ID
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-5 text-gray-300 pointer-events-none" size={18} strokeWidth={1.5}  />
                <input
                  type="email"
                  placeholder="email@domain.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 py-5 pl-14 pr-6 rounded-2xl text-sm font-semibold transition-all focus:bg-white focus:ring-[6px] focus:ring-gray-50 focus:border-black/10 outline-none text-black"
                  required
                 />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                Access Key
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-5 text-gray-300 pointer-events-none" size={18} strokeWidth={1.5}  />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 py-5 pl-14 pr-6 rounded-2xl text-sm font-semibold transition-all focus:bg-white focus:ring-[6px] focus:ring-gray-50 focus:border-black/10 outline-none text-black"
                  required
                 />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-black text-white py-6 rounded-2xl flex items-center justify-center gap-4 group transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] disabled:bg-gray-800"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18}  />
              ) : (
                <>
                  <span className="text-xs font-black uppercase tracking-[0.2em] italic">
                    Initialize Login
                  </span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1"  />
                < />
              )}
            </motion.button>
          </form>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center px-4">
            System Alert: Unauthorized access is strictly logged and reported
          </p>
        </div>
      </motion.div>
    </div>
  );
}