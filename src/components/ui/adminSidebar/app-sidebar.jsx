import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Box, Tags, DollarSign, Users, Settings, 
  ShoppingCart, Star, ChevronRight, Zap, Layers,
  LayoutGrid, Globe, Percent, Package, Tag
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/adminSidebar/sidebar";

const items = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  {
    title: "Product",
    icon: Box,
    sub_items: [
      { title: "All Products", url: "/admin/allproduct", icon: Package },
      { title: "Categories", url: "/admin/categorie", icon: LayoutGrid },
      { title: "Brands", url: "/admin/brand", icon: Globe },
      { title: "Tax rule", url: "/admin/taxrule", icon: Percent },
      { title: "Collection", url: "/admin/collection", icon: Layers },
    ],
  },
  {
    title: "Orders",
    icon: DollarSign,
    sub_items: [
      { title: "Website Orders", url: "/admin/orders/websiteOrders" },
    ],
  },
  { title: "Users", url: "/admin/user", icon: Users },
  { title: "Subscription", url: "/admin/subscription", icon: Zap },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-gray-100 transition-all duration-300 ease-in-out bg-white"
    >
      <SidebarContent className="flex flex-col h-full bg-white">
        <div className="p-6">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-black/10">
              <Package className="text-white" size={20} />
            </div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col whitespace-nowrap"
                >
                  <span className="font-black text-sm tracking-tight text-gray-900 uppercase">SHOP.CO</span>
                  <span className="text-[10px] font-bold text-gray-400 leading-none">Inventory Manager</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <SidebarGroup className="flex-1 px-4">
          <SidebarGroupContent>
            <div className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem 
                  key={item.title} 
                  item={item} 
                  pathname={pathname} 
                  isCollapsed={isCollapsed} 
                />
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="p-4 mt-auto">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100"
              >
                <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <p className="text-[10px] text-blue-800 font-bold tracking-tight">Admin System v2.0</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarMenuItem({ item, pathname, isCollapsed }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const hasSubItems = item.sub_items && item.sub_items.length > 0;
  const isActive = pathname === item.url || item.sub_items?.some(sub => pathname === sub.url);

  const handleClick = () => {
    if (hasSubItems) {
      setIsOpen(!isOpen);
    } else if (item.url) {
      navigate(item.url);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={handleClick}
        className={`
          flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group w-full
          ${isActive ? "bg-black text-white shadow-md" : "text-gray-500 hover:bg-gray-50 hover:text-black"}
        `}
      >
        <item.icon size={20} className={`shrink-0 ${isActive ? "text-white" : "group-hover:text-black"}`} />
        
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-center justify-between flex-1 overflow-hidden"
          >
            <span className="text-sm font-bold truncate">{item.title}</span>
            {hasSubItems && (
              <ChevronRight 
                size={16} 
                className={`transition-transform duration-200 shrink-0 ${isOpen ? "rotate-90" : ""}`} 
              />
            )}
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && !isCollapsed && hasSubItems && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden ml-11 mt-1 space-y-1 border-l-2 border-gray-100"
          >
            {item.sub_items.map((sub) => (
              <Link
                key={sub.url}
                to={sub.url}
                className={`
                  block py-2 px-3 text-xs font-bold rounded-lg transition-colors
                  ${pathname === sub.url ? "text-black bg-gray-50" : "text-gray-400 hover:text-black"}
                `}
              >
                {sub.title}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}