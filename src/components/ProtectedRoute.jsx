import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/account/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('auth_token');
        navigate('/account/login');
      } else {
        setIsVerified(true);
      }
    } catch (e) {
      localStorage.removeItem('auth_token');
      navigate('/account/login');
    }
  }, [navigate]);

  if (!isVerified) {
    return (
      <div className="h-screen flex items-center justify-center font-black italic uppercase tracking-widest text-black">
        Verifying Session...
      </div>
    );
  }

  return children;
}
