import React, { Suspense } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import PromoBanner from "../components/topBar";
import { ProductContent } from "./ProductContent"; // Adjust path as needed

export default function Page() {
  return (
    <div className="bg-white min-h-screen font-sans">
      <PromoBanner  />
      <Navbar  />

      <SidebarProvider>
        <div className="flex w-full max-w-[1440px] mx-auto min-h-screen">
          {/* Wrap the dynamic part in Suspense. 
              This fixes the "useSearchParams() should be wrapped in a suspense boundary" error.
          */}
          <Suspense fallback={
            <div className="flex-1 flex justify-center items-center h-96">
              <p className="text-stone-400 animate-pulse tracking-widest uppercase text-xs">
                Preparing Gallery...
              </p>
            </div>
          }>
            <ProductContent  />
          </Suspense>
        </div>
      </SidebarProvider>

      <Footer  />
    </div>
  );
}