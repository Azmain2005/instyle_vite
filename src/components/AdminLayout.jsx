import Providers from "./Providers";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AppSidebar } from '@/components/ui/adminSidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/adminSidebar/sidebar';
import React from 'react';
import FloatingSidebarTrigger from "@/components/FloatingSidebarTrigger";
import AdminNavbar from "./AdminNavbar";
import { Toaster } from 'react-hot-toast';

import MobileSidebarToggle from "@/components/MobileSidebarToggle";

import { Outlet } from 'react-router-dom';

const CLIENT_ID =
    "1037614128251-kk326tc7ll40i5gfo3f6d0flc3n6tjmc.apps.googleusercontent.com";

export default function AdminLayout() {
    return (
        <div className="admin-layout">
                <Providers>
                    <AdminNavbar  />
                    <GoogleOAuthProvider clientId={CLIENT_ID}>
                        <SidebarProvider>                            
                            <AppSidebar  />
                            <FloatingSidebarTrigger  />
                            <MobileSidebarToggle  />
                            <Outlet />
                            <Toaster position="top-center" toastOptions={{ duration: 3000 }}  />
                        </SidebarProvider>
                    </GoogleOAuthProvider>
                </Providers>
        </div>
    );
}
