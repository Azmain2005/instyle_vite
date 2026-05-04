
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package, ShoppingBag, Clock, Globe, Zap,
  ArrowUpRight, MapPin, Phone, MessageSquare, LayoutGrid, XCircle
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';




// --- Animation & Nav Constants ---
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };


export default function OrdersPage() {
  const pathname = useLocation().pathname;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/order`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter calculations
  const pendingCount = orders.filter(o => o.orderStatus === "pending").length;
  const cancelledCount = orders.filter(o => o.orderStatus === "cancelled").length;
  const activeCount = orders.filter(o => o.orderStatus !== "pending" && o.orderStatus !== "cancelled").length;

  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] relative overflow-x-hidden">
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-200/30 rounded-full blur-[120px] pointer-events-none"  />

      <header className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg"><Zap className="text-white" size={20}  /></div>
            <span className="text-xl font-black tracking-tighter uppercase italic">Vantage Admin</span>
          </div>

        </div>
      </header>

      <motion.main variants={containerVariants} initial="hidden" animate="show" className="w-full p-6 lg:p-10 space-y-10 relative z-10">

        {/* STATS SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Orders" value={orders.length} icon={ShoppingBag} text="text-blue-600" light="bg-blue-100/50"  />
          <StatCard label="Pending Orders" value={pendingCount} icon={Clock} text="text-amber-600" light="bg-amber-100/50"  />
          <StatCard label="Cancelled" value={cancelledCount} icon={XCircle} text="text-rose-600" light="bg-rose-100/50"  />
          <StatCard label="Confirmed/shipped/delivered" value={activeCount} icon={Zap} text="text-emerald-600" light="bg-emerald-100/50"  />
        </section>

        {/* ORDERS TABLE */}
        <motion.section variants={itemVariants} className="w-full bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
          <h2 className="text-3xl font-black tracking-tighter italic uppercase flex items-center gap-4 mb-10">
            <div className="w-3 h-10 bg-black rounded-full"  /> Live Order Stream
          </h2>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                  <th className="pb-4 px-6">Products</th>
                  <th className="pb-4 px-6">Customer</th>
                  <th className="pb-4 px-6">Location</th>
                  <th className="pb-4 px-6">Order Status</th>
                  <th className="pb-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0).reverse().map((order) => (
                  <tr key={order._id} className="group hover:bg-gray-50/50 transition-all">

                    {/* PRODUCT IMAGES */}
                    
                    {/* <td className="py-6 px-6 bg-gray-50/30 group-hover:bg-white rounded-l-[2.5rem]">
                      <div className="flex -space-x-4">
                        {order.cartId?.products?.map((item, idx) => (
                          <div key={idx} className="relative w-14 h-14 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gray-200 transition-transform group-hover:scale-110 group-hover:z-30" style={{ zIndex: 10 - idx }}>
                            <img src={item.product?.photos?.[0] || "/placeholder.png"} alt="product" fill className="object-cover" unoptimized  />
                            {item.count > 1 && (
                              <span className="absolute bottom-0 right-0 bg-black text-white text-[8px] px-1.5 py-0.5 font-black rounded-tl-lg z-40">{item.count}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td> */}
                    <td className="py-6 px-6 bg-gray-50/30 group-hover:bg-white rounded-l-[2.5rem]">
                      <div className="flex">
                        {order.cartId?.products?.[0] && (
                          <div className="relative w-14 h-14 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gray-200 transition-transform group-hover:scale-110 group-hover:z-30">
                            <img
                              src={order.cartId.products[0].product?.photos?.[0] || "/placeholder.png"}
                              alt="product"
                              fill
                              className="object-cover"
                              unoptimized
                             />
                            {order.cartId.products[0].count > 1 && (
                              <span className="absolute bottom-0 right-0 bg-black text-white text-[8px] px-1.5 py-0.5 font-black rounded-tl-lg z-40">
                                {order.cartId.products[0].count}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>


                    {/* CUSTOMER INFO */}
                    <td className="py-6 px-6 group-hover:bg-white">
                      <div>
                        <p className="font-black text-black uppercase tracking-tighter">{order.name}</p>
                        <p className="flex items-center gap-2 text-gray-400 text-[11px] font-bold"><Phone size={12}  /> {order.number}</p>
                      </div>
                    </td>

                    {/* LOCATION */}
                    <td className="py-6 px-6 group-hover:bg-white">
                      <div className="max-w-[200px]">
                        <p className="text-xs font-bold text-gray-600 flex items-center gap-2"><MapPin size={12} className="text-rose-500"  /> {order.city}</p>
                        <p className="text-[10px] text-gray-400 truncate uppercase font-black">{order.address}</p>
                      </div>
                    </td>

                    {/* DYNAMIC ORDER-STATUS */}
                    <td className="py-6 px-6 group-hover:bg-white">
                      <div className="flex flex-col gap-2">
                        {(() => {
                          let statusStyles = "bg-emerald-100 text-emerald-700"; // Default: Confirmed/Others

                          if (order.orderStatus === "pending") {
                            statusStyles = "bg-amber-100 text-amber-700"; // Yellow
                          } else if (order.orderStatus === "cancelled") {
                            statusStyles = "bg-rose-100 text-rose-700"; // Red
                          }

                          return (
                            <span className={`w-fit px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-colors ${statusStyles}`}>
                              {order.orderStatus}
                            </span>
                          );
                        })()}
                        {order.orderNote && order.orderNote !== "No note provided" && (
                          <div className="flex items-center gap-1 text-blue-500 animate-pulse">
                            <MessageSquare size={10}  />
                            <span className="text-[9px] font-bold italic">Note Attached</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* ACTION */}
                    <td className="py-6 px-6 text-right group-hover:bg-white rounded-r-[2.5rem]">
                      <Link to={`/admin/orders/websiteOrders/orderdetails/${order._id}`}>
                        <button className="p-3 bg-gray-100 text-black hover:bg-black hover:text-white rounded-xl transition-all shadow-sm">
                          <ArrowUpRight size={16}  />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, text, light }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex justify-between items-center group">
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
        <h3 className="text-4xl font-black text-black tracking-tighter">{value}</h3>
      </div>
      <div className={`w-14 h-14 ${light} ${text} rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12`}>
        <Icon size={28}  />
      </div>
    </div>
  );
}