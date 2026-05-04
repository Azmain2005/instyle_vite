import React from 'react';
import Providers from "./Providers";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

import { Outlet } from 'react-router-dom';

const CLIENT_ID = "1037614128251-kk326tc7ll40i5gfo3f6d0flc3n6tjmc.apps.googleusercontent.com";

export default function MainLayout() {
  return (
    <div className="antialiased">
      <Providers>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <Outlet />
          <Toaster position="top-center" reverseOrder={false}  />
        </GoogleOAuthProvider>
      </Providers>
    </div>
  );
}
