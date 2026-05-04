
import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    localStorage.removeItem('auth_token');
    Cookies.remove('auth_token');
    navigate('/account/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">

        {/* LEFT SIDE: Logo */}
        <div className="flex items-center space-x-3">
          <div className={`text-2xl font-bold ${isMobileMenuOpen ? 'hidden sm:block' : 'block'}`}>
            <span className="text-black">SHOP</span>.<span className="text-gray-600">CO</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-3">

          {/* MOBILE LOGOUT: Visible only on small screens (hidden on md+) */}
          <button
            onClick={handleLogout}
            className="md:hidden flex items-center justify-center p-2 pr-10 text-gray-600 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-6 h-6"  />
          </button>

          {/* DESKTOP LOGOUT: Visible only on md screens and up */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600 text-sm transition-colors"
            >
              <LogOut className="w-5 h-5 mr-1"  />
              <span>Logout</span>
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}