import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, MapPin, Phone, User } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';





export default function OrderPage() {
    const { id } = useParams();
    const [selectedValue, setSelectedValue] = useState("");
    const [message, setMessage] = useState("");



    const navigate = useNavigate();




    const handleChange = (e) => {
        setSelectedValue(e.target.value);
        console.log(e.target.value);
    };

    const { data: order, isLoading, error } = useQuery({
        queryKey: ["order", id],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/order/${id}`);
            if (!res.ok) throw new Error("Failed to fetch order");
            return res.json();
        },
    });


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
        if (order?.orderStatus) {
            setSelectedValue(order.orderStatus);
        }
    }, [order]);


    const updateOrderStatus = async (id) => {
        if (!selectedValue.trim()) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/order/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderStatus: selectedValue }),
            });
            if (res.ok) {
                setMessage("Success: Order status updated");
                window.location.reload();
                setEditingId(null);
                fetchBrands();
            }
        } catch (err) {
            setMessage("Error: " + err.message);
        }
    };


    const getAttributePrice = (item) => {
        // 1. Start with base selling price
        let selectedPrice = item.product.selling;

        // 2. If there are selected attributes, look up their specific price
        if (item.attributes && item.product.attributes) {
            const selectedEntries = Object.entries(item.attributes);
            if (selectedEntries.length > 0) {
                const [selectedKey, selectedVal] = selectedEntries[0];

                const productAttr = item.product.attributes.find(
                    (a) => a.title.toLowerCase() === selectedKey.toLowerCase()
                );

                if (productAttr) {
                    const valueObj = productAttr.values.find(
                        (v) => v.val.toLowerCase() === selectedVal.toLowerCase()
                    );
                    if (valueObj && valueObj.price) {
                        selectedPrice = valueObj.price;
                    }
                }
            }
        }
        return selectedPrice;
    };




    if (isLoading) return (
        <div className="flex flex-col justify-center items-center min-h-[60vh] bg-white gap-4">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Loading Order Details...</p>
        </div>
    );

    if (error || !order) return (
        <div className="p-20 text-center min-h-screen flex flex-col justify-center items-center">
            <h2 className="text-2xl font-black text-red-500 uppercase italic tracking-tighter">Order Error</h2>
            <p className="text-gray-600 font-bold mt-2">Could not retrieve order: {id}</p>
        </div>
    );

    const { cartId, name, number, address, city, orderStatus, createdAt } = order;

    const subtotal = cartId?.products?.reduce((acc, item) => {
        const actualPrice = getAttributePrice(item);
        return acc + (actualPrice * item.count);
    }, 0) || 0;

    // 1. Determine the fee based on the city string stored in the order
    const deliveryFee = city?.toLowerCase().includes("inside dhaka") ? 80 : 150;
    
    // 2. Calculate the final total
    const totalAmount = subtotal + deliveryFee;
    
    // 3. Set a safe currency string
    const currency = cartId?.currency || "BDT";



    return (
        <div className="min-h-screen bg-white w-full">
            {/* Main container changed to w-full and px-6 to utilize the whole screen */}
            <main className="w-full px-6 lg:px-10 py-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b-2 border-black/5 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-8 bg-black rounded-full"  />
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase italic tracking-tighter">Order Summary</h1>
                            <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] shadow-sm ${orderStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                {orderStatus}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Serial: {id}</p>
                    </div>

                    <div className="text-left md:text-right bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Date Placed</p>
                        <p className="font-black text-black uppercase tracking-tighter">
                            {new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Layout Grid - Now spans full width */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Items */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 mb-12">
                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

                                {/* Input Section */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-2 ml-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"  />
                                        <label htmlFor="status-select" className="text-[11px] uppercase font-bold text-gray-400 tracking-[0.25em]">
                                            Order Management
                                        </label>
                                    </div>

                                    <div className="relative group max-w-sm">
                                        <select
                                            id="status-select"
                                            value={selectedValue}
                                            onChange={handleChange}
                                            className="w-full appearance-none bg-gray-50/50 border border-gray-200 px-6 py-4 rounded-2xl text-sm font-semibold text-gray-800 transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none cursor-pointer group-hover:border-gray-300"
                                        >
                                            <option value="" >Update fulfillment status...</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>

                                        {/* Elegant Chevron Icon */}
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"  /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Preview Card */}
                                <div className="bg-gray-50/80 px-8 py-4 rounded-2xl border border-gray-100 flex items-center gap-6 min-w-[280px]">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">New State</p>
                                        <p className={`text-sm font-extrabold uppercase tracking-tighter transition-colors duration-500 ${selectedValue === 'pending' ? 'text-amber-500' :
                                            selectedValue === 'cancelled' ? 'text-rose-500' : 'text-blue-600'
                                            }`}>
                                            {selectedValue || "Selection Required"}
                                        </p>
                                    </div>
                                    <div className="h-8 w-[1px] bg-gray-200"  />
                                    <div className="flex-1">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Impact</p>
                                        <p className="text-[11px] text-gray-500 leading-tight">
                                            This will notify the customer via email.
                                        </p>
                                    </div>
                                </div>

                                {/* Luxury Action Button */}
                                <div className="flex items-center">
                                    <button
                                        onClick={() => updateOrderStatus(id)}
                                        disabled={!selectedValue}
                                        className={`relative overflow-hidden px-10 py-4 rounded-2xl font-bold text-sm tracking-tight transition-all duration-500 ${!selectedValue
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-900 text-white hover:bg-black hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] active:scale-95'
                                            }`}
                                    >
                                        <span className="relative z-10">Save Changes</span>
                                        {selectedValue && (
                                            <motion.div
                                                layoutId="btn-bg"
                                                className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent"
                                             />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>



                        <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3 px-4">
                            <Package size={24} className="text-black"  /> Item List
                        </h3>

                        {cartId?.products?.map((item, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx}
                                className="flex flex-col sm:flex-row gap-6 p-6 rounded-[2rem] bg-white border border-gray-100 hover:border-black transition-all group"
                            >
                                {/* Image Fix: Using standard <img> tag for instant display of external URLs */}
                                <div className="w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 relative border border-gray-100 flex items-center justify-center">
                                    <img
                                        src={item.product?.photos?.[0] || "/placeholder.png"}
                                        alt={item.product.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                     />
                                </div>

                                <div className="flex-1 flex flex-col justify-between w-full">
                                    <div>
                                        <h4 className="font-black text-2xl text-gray-900 uppercase tracking-tighter italic leading-none mb-3">
                                            {item.product.title}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(item.attributes).map(([key, val]) => (
                                                <span key={key} className="text-[10px] uppercase font-black tracking-widest bg-gray-50 px-3 py-1 rounded-lg text-gray-400 border border-gray-100">
                                                    {key}: <span className="text-black">{val}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Calculation Display */}
                                    <div className="mt-4 sm:mt-0 flex items-end justify-between border-t border-dashed border-gray-200 pt-4">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            {/* CHANGE item.product.selling to getAttributePrice(item) */}
                                            {getAttributePrice(item)} x {item.count} Units
                                        </div>
                                        <div className="text-2xl font-black text-black tracking-tighter italic">
                                            {/* CHANGE item.product.selling to getAttributePrice(item) */}
                                            {getAttributePrice(item) * item.count} <span className="text-sm not-italic ml-1">{cartId.currency}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
{/* Right Column: Order Sidebar */}
<div className="lg:col-span-4 space-y-6">

    {/* Shipping & Billing Info */}
    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl space-y-8 sticky top-10">
        <div>
            <h4 className="text-[10px] uppercase font-black text-gray-300 tracking-[0.3em] mb-6 text-center">Logistics Port</h4>
            <div className="space-y-5">
                <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-lg">
                        <User size={18}  />
                    </div>
                    <span className="font-black uppercase tracking-tighter text-lg">{name}</span>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <Phone size={18}  />
                    </div>
                    <span className="font-bold text-gray-600">{number}</span>
                </div>
                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 flex-shrink-0">
                        <MapPin size={18}  />
                    </div>
                    <span className="font-bold text-gray-500 leading-tight uppercase text-xs">
                        {address}, <br  />
                        <span className="text-black font-black text-sm">{city}</span>
                    </span>
                </div>
            </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
            <h4 className="text-[10px] uppercase font-black text-gray-300 tracking-[0.3em] mb-6 text-center">Summary</h4>
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold tracking-tight text-gray-500 uppercase">
                    <span>Subtotal</span>
                    <span className="font-black text-black">{subtotal} {currency}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold tracking-tight text-gray-500 uppercase">
                    <div className="flex flex-col">
                        <span>Delivery Fee</span>
                        <span className="text-[9px] text-gray-400 normal-case">{city}</span>
                    </div>
                    <span className="font-black text-emerald-600">+{deliveryFee} {currency}</span>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-dashed border-gray-200 mt-5">
                    <span className="text-xl font-black uppercase italic tracking-tighter">Total</span>
                    <span className="text-3xl font-black italic tracking-tighter text-black">
                        {totalAmount} {currency}
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>

                </div>
            </main>
        </div>
    );
}

