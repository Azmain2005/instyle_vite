
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from 'jwt-decode';
import {
  Package, ShoppingBag, DollarSign, LayoutGrid, 
  CheckCircle2, XCircle, Zap, ArrowRight,
  Calendar, ChevronDown, Trophy, Clock
} from "lucide-react";


const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/order`);
        if (!res.ok) throw new Error("Failed to reach database");
        const data = await res.json();
        setOrders(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Database Connection Error:", err);
        setIsLoading(false);
      }
    };

    const token = localStorage.getItem('auth_token');
    if (!token) return navigate('/account/login');
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('auth_token');
        navigate('/account/login');
      } else { fetchOrders(); }
    } catch (e) { navigate('/account/login'); }
  }, [navigate]);

// --- Real-Time Database Processing ---
  const processed = useMemo(() => {
    let revenue = 0;
    let pending = 0;
    let cancelled = 0;
    let confirmed = 0;
    const dailyMap = {};
    const productStats = {}; 
    
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    // Helper to find the specific attribute price
    // Helper to find the specific attribute price
    const getActualPrice = (item) => {
      let price = item.product?.selling || 0;
      
      // Add a check to see if attributes exist and are not empty
      if (item.attributes && item.product?.attributes && Object.keys(item.attributes).length > 0) {
        const selectedEntries = Object.entries(item.attributes);
        const [sKey, sVal] = selectedEntries[0];

        // Ensure sVal exists before trying to use it
        if (!sVal) return price;

        const attrGroup = item.product.attributes.find(
          a => a?.title?.toLowerCase() === sKey.toLowerCase()
        );

        if (attrGroup && attrGroup.values) {
          const valObj = attrGroup.values.find(
            // SAFE CHECK: Use ?. and check for existence of v.val
            v => v?.val && v.val.toLowerCase() === sVal.toString().toLowerCase()
          );
          
          if (valObj && valObj.price) {
            price = valObj.price;
          }
        }
      }
      return price;
    };

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      if (date.getMonth() === selectedMonth && date.getFullYear() === selectedYear) {
        
        // 1. Calculate order total using the attribute-aware helper
        const orderTotal = order.cartId?.products?.reduce((acc, p) => {
          const actualPrice = getActualPrice(p);
          return acc + (actualPrice * (p.count || 0));
        }, 0) || 0;
        
        if (order.orderStatus !== 'cancelled') {
          revenue += orderTotal;
          confirmed++;

          // 2. Product Performance Logic using correct price
          order.cartId?.products?.forEach(p => {
            if (!p.product?.title) return;
            
            // Identify unique product+size combination
            const sizeVal = p.attributes?.size || "Standard";
            const key = `${p.product.title}-${sizeVal}`;
            const actualPrice = getActualPrice(p);

            if (!productStats[key]) {
              productStats[key] = { title: p.product.title, size: sizeVal, sold: 0, revenue: 0 };
            }
            productStats[key].sold += (p.count || 0);
            productStats[key].revenue += (actualPrice * (p.count || 0));
          });
        }
        
        if (order.orderStatus === 'pending') pending++;
        if (order.orderStatus === 'cancelled') cancelled++;

        const day = date.getDate();
        dailyMap[day] = (dailyMap[day] || 0) + orderTotal;
      }
    });

    const chartData = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      sales: dailyMap[i + 1] || 0
    }));

    const topThree = Object.values(productStats)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 3);

    return { revenue, pending, cancelled, confirmed, chartData, topThree };
  }, [orders, selectedMonth, selectedYear]);

  if (isLoading) return <div className="h-screen flex items-center justify-center font-black italic uppercase tracking-widest text-black">Initialising Database...</div>;

  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] relative overflow-x-hidden pb-20">
      {/* Background Decor */}
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none"  />
      <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-purple-100/40 rounded-full blur-[120px] pointer-events-none"  />

      {/* HEADER */}
      <header className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40">
        <div className="w-full px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="text-white" size={20} fill="currentColor"  />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic text-black">Vantage Admin</span>
          </div>



          <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer relative shadow-xl shadow-black/10">
            <Calendar size={14}  />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-transparent outline-none cursor-pointer appearance-none pr-4"
            >
              {months.map((m, i) => <option key={m} value={i} className="text-black">{m}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 pointer-events-none"  />
          </div>
        </div>
      </header>

      <motion.main variants={containerVariants} initial="hidden" animate="show" className="w-full p-6 lg:p-10 space-y-10 relative z-10">
        
        {/* TOP STATS - Functional Focus */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Monthly Revenue" value={`৳${processed.revenue.toLocaleString()}`} icon={DollarSign} text="text-blue-600" light="bg-blue-100/50"  />
          <StatCard label="Pending Approval" value={processed.pending} icon={Clock} text="text-amber-600" light="bg-amber-100/50"  />
          <StatCard label="Confirmed Orders" value={processed.confirmed} icon={CheckCircle2} text="text-emerald-600" light="bg-emerald-100/50"  />
          <StatCard label="Cancelled" value={processed.cancelled} icon={XCircle} text="text-rose-600" light="bg-rose-100/50"  />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Revenue Chart */}
          <motion.section variants={itemVariants} className="xl:col-span-3 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-black tracking-tighter italic uppercase flex items-center gap-4 text-black">
                  <div className="w-3 h-10 bg-black rounded-full"  />
                  {months[selectedMonth]} Performance
                </h2>
                <p className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-widest">Revenue Waveform</p>
              </div>
            </div>

            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processed.chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="10 10" stroke="#f1f1f1"  />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#bbb', fontSize: 10, fontWeight: '900' }}  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#bbb', fontSize: 10, fontWeight: '900' }}  />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} content={<CustomTooltip month={months[selectedMonth]}  />}  />
                  <Bar dataKey="sales" radius={[6, 6, 6, 6]} barSize={14}>
                    {processed.chartData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.sales > 0 ? '#000' : '#f3f4f6'}  />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.section>

          {/* SIDEBAR: CLEAN LEADERBOARD */}
          <motion.section variants={itemVariants} className="bg-white border border-gray-100 p-8 rounded-[3rem] shadow-sm h-fit">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <Trophy size={14} className="text-amber-500"  /> Top Sellers
              </h3>
              <span className="text-[8px] font-black bg-gray-100 px-2 py-1 rounded text-gray-400 uppercase tracking-widest italic">Leaderboard</span>
            </div>

            <div className="space-y-10">
              {processed.topThree.length > 0 ? (
                processed.topThree.map((prod, i) => (
                  <div key={i} className="flex items-center gap-5 group">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-xl italic border border-gray-100 group-hover:bg-black group-hover:text-white transition-all duration-500">
                        {i + 1}
                      </div>
                      {i === 0 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full border-4 border-white shadow-sm"  />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black uppercase truncate leading-none mb-1.5 text-black tracking-tighter">{prod.title}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Size: <span className="text-black/80 font-black">{prod.size}</span> • {prod.sold} Sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-black text-black italic">৳{prod.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center opacity-10 font-black uppercase text-[10px] tracking-[0.3em]">No Recorded Sales</div>
              )}
            </div>

            <Link to="/admin/allproduct" className="mt-12 w-full py-5 border border-dashed border-gray-200 rounded-3xl flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:border-black hover:text-black transition-all group">
              Inventory Check <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform"  />
            </Link>
          </motion.section>
        </div>
      </motion.main>
    </div>
  );
}

// --- Dynamic Sub Components ---

function StatCard({ label, value, icon: Icon, text, light }) {
  return (
    <motion.div variants={itemVariants} whileHover={{ y: -8 }} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex justify-between items-center group">
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
        <h3 className="text-4xl font-black text-black tracking-tighter">{value}</h3>
      </div>
      <div className={`w-16 h-16 ${light} ${text} rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon size={32}  />
      </div>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, month }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white p-5 rounded-[2rem] shadow-2xl border border-white/10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{month} {payload[0].payload.day}</p>
        <p className="text-2xl font-black italic">৳{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}