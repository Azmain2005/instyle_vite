import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiUser, FiX, FiMenu, FiChevronRight } from "react-icons/fi";

const NAV_LINKS = [
  { label: "Collections", href: "/product" },
  { label: "Product", href: "/product", hasDropdown: true },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeParentId, setActiveParentId] = useState(null);

  // Find the currently hovered parent object
  const activeParent = categories.find(c => c._id === activeParentId);
  const hasSubCategories = activeParent?.subCategories?.length > 0;

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categorie`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const parents = data.filter(cat => cat.type === "parent");
          const children = data.filter(cat => cat.type === "child");
          const organized = parents.map(parent => ({
            ...parent,
            subCategories: children.filter(child => child.parentid === parent._id)
          }));
          setCategories(organized);
          if (organized.length > 0) setActiveParentId(organized[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch nav categories", err);
      }
    };
    fetchNavData();
  }, []);

  return (
    <>
      <nav className="w-full bg-white/90 backdrop-blur-md border-b border-stone-100 sticky top-0 z-[40] h-20">
        <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
          
          <button onClick={() => setIsMobileOpen(true)} className="md:hidden text-2xl text-stone-800 p-2"><FiMenu  /></button>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <h1 className="text-xl md:text-2xl font-serif tracking-widest text-stone-900 uppercase">
              InStyle<span className="font-light italic text-stone-500 text-lg">by</span>Shifa
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-8 h-full">
            {NAV_LINKS.map((link) => (
              <div 
                key={link.label} 
                className="relative h-full flex items-center"
                onMouseEnter={() => link.hasDropdown && setIsProductOpen(true)}
                onMouseLeave={() => link.hasDropdown && setIsProductOpen(false)}
              >
                <Link
                  to={link.href}
                  className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-600 hover:text-black transition-all"
                >
                  {link.label}
                </Link>

                <AnimatePresence>
                  {link.hasDropdown && isProductOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        width: hasSubCategories ? "600px" : "220px" // Dynamic Width
                      }} 
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="absolute top-20 left-0 bg-white border border-stone-100 shadow-2xl rounded-sm overflow-hidden flex"
                    >
                      {/* Parent Categories List */}
                      <div className={`${hasSubCategories ? 'w-1/3' : 'w-full'} bg-stone-50 border-r border-stone-100 py-2 transition-all duration-300`}>
                        {categories.map((parent) => (
                          <div
                            key={parent._id}
                            onMouseEnter={() => setActiveParentId(parent._id)}
                            className={`group/item flex items-center justify-between transition-colors ${
                              activeParentId === parent._id ? "bg-white" : "hover:bg-stone-100"
                            }`}
                          >
                            <Link
                              to={`/product?category=${parent._id}`}
                              className={`flex-1 px-5 py-3 text-[9px] uppercase tracking-widest transition-all ${
                                activeParentId === parent._id ? "text-black font-bold" : "text-stone-500 hover:text-black"
                              }`}
                            >
                              {parent.title}
                            </Link>
                            {/* Arrow only shows if there are sub-items to expand to */}
                            {parent.subCategories.length > 0 && (
                              <FiChevronRight className={`mr-3 text-stone-300 ${activeParentId === parent._id ? 'text-black' : ''}`} size={12}  />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Sub Categories Panel - Only visible if active parent has items */}
                      {hasSubCategories && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="w-2/3 p-8 grid grid-cols-2 gap-y-4 gap-x-8 bg-white content-start"
                        >
                          {activeParent.subCategories.map((sub) => (
                            <Link 
                              key={sub._id} 
                              to={`/product?category=${sub._id}`}
                              className="text-[10px] uppercase tracking-[0.15em] text-stone-500 hover:text-[#D4AF37] transition-colors border-b border-transparent hover:border-[#D4AF37] pb-1 w-fit"
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* <Link to="/login"><FiUser className="text-xl text-stone-800"  /></Link> */}
            <Link to="/cart" className="relative p-2">
              <FiShoppingCart className="text-xl text-stone-800"  />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (Condensed sub-category logic) */}
      <AnimatePresence>
  {isMobileOpen && (
    <>
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={() => setIsMobileOpen(false)} 
        className="fixed inset-0 bg-black/40 z-[110] backdrop-blur-[2px] md:hidden" 
       />
      
      {/* Drawer Content */}
      <motion.div 
        initial={{ x: "-100%" }} 
        animate={{ x: 0 }} 
        exit={{ x: "-100%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }} // Smoother than spring for sidebars
        className="fixed top-0 left-0 h-full w-[85%] max-w-[400px] bg-white z-[120] p-8 overflow-y-auto shadow-2xl"
      >
        <div className="flex justify-between items-center mb-10">
          <span className="text-xs font-bold tracking-widest uppercase text-stone-400">Menu</span>
          <button onClick={() => setIsMobileOpen(false)} className="text-2xl p-2 -mr-2"><FiX  /></button>
        </div>

        <div className="flex flex-col gap-8">
          {NAV_LINKS.map((link) => (
            <div key={link.label}>
              <Link 
                to={link.href} 
                onClick={() => !link.hasDropdown && setIsMobileOpen(false)} 
                className="text-xl font-serif text-stone-800 uppercase tracking-wider block"
              >
                {link.label}
              </Link>
              
              {link.hasDropdown && (
                <div className="mt-6 flex flex-col gap-6">
                  {categories.map(parent => (
                    <div key={parent._id} className="space-y-3">
                      <Link 
                        to={`/product?category=${parent._id}`}
                        onClick={() => setIsMobileOpen(false)}
                        className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-900 block border-b border-stone-100 pb-1"
                      >
                        {parent.title}
                      </Link>
                      {parent.subCategories.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 ml-2">
                          {parent.subCategories.map(sub => (
                            <Link 
                              key={sub._id} 
                              to={`/product?category=${sub._id}`} 
                              onClick={() => setIsMobileOpen(false)} 
                              className="text-[10px] uppercase tracking-widest text-stone-500 py-1"
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    < />
  )}
</AnimatePresence>
    < />
  );
}