
import { useEffect } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PromoBanner from "@/components/topBar";
import FestiveBanner from "@/components/FestiveBanner";
import TrendingCategories from "@/components/TrendingCategories";
import CollectionBanner from "@/components/CollectionBanner";
import FeaturedProducts from "@/components/FeaturedProducts";

// Modest women's fashion — editorial collection images (verified Unsplash IDs)
// Change this:
const COLLECTION_IMAGES = {
  abaya: "/abaya.png",  // Clean path
  kaftan: "/kaftan.png",
  borka: "/borka.png",
  hijab: "/hijab.png",
  kids: "https://images.unsplash.com/photo-1542156822-6924d1a71ace?w=900&q=85&fit=crop",
};


export default function App() {

  // --- Cart Synchronization Logic ---
  const ensureActiveCart = async () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const existingId = localStorage.getItem("cartId");

    const createNewCart = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products: [], cartStatus: "editing", currency: "BDT" }),
        });
        if (!res.ok) return;
        const data = await res.json();
        localStorage.setItem("cartId", data._id);
        console.log("Atelier Session Initialized:", data._id);
      } catch (err) {
        console.error("Cart setup failed", err);
      }
    };

    if (existingId) {
      try {
        const res = await fetch(`${BACKEND_URL}/cart/${existingId}`);
        if (res.ok) {
          const cart = await res.json();
          // If the existing cart is already checked out (pending/completed), create a new one
          if (cart.cartStatus !== "editing") await createNewCart();
        } else {
          await createNewCart(); // ID not found in DB
        }
      } catch (err) {
        console.warn("Sync delayed due to network.");
      }
    } else {
      await createNewCart();
    }
  };

  useEffect(() => {
    ensureActiveCart();
  }, []);


  return (
    <div className="bg-white">
      {/* Top promo + Navbar */}
      <div className="sticky top-0 z-[60]"> {/* Keeps Nav on top of Sidebar */}
        <PromoBanner  />
        <Navbar  />
      </div>

      {/* 1. Festive Eid/Boishakhi hero banner */}
      <FestiveBanner  />

      {/* 2. Trending Categories — Abaya, Kaftan, Borka, Hijab, Prayer Set, Kids */}
      <TrendingCategories  />

      {/* 3. Abaya Collection */}
      {/* <CollectionBanner
        title="ABAYA COLLECTION"
        subtitle="Timeless Elegance · Modest Luxury"
        imageUrl={COLLECTION_IMAGES.abaya}
        imageAlign="right"
        bgColor="bg-[#EDE8E1]"
        // This sends "abaya" to the product page URL
        href="/product?category=abaya"
       /> */}

      {/* 4. Kaftan Collection — image left */}
      {/* <CollectionBanner
        title="KAFTAN COLLECTION"
        subtitle="Flowing Grace · Premium Fabrics"
        imageUrl={COLLECTION_IMAGES.kaftan}
        imageAlign="left"
        bgColor="bg-[#F5F0EB]"
        href="/product?category=kaftan"
       /> */}

      {/* 5. Featured Products grid */}
      <FeaturedProducts  />

      {/* 6. Borka Collection — image right */}
      <CollectionBanner
        title="BORKA COLLECTION"
        subtitle="Modest · Refined · Comfortable"
        imageUrl={COLLECTION_IMAGES.borka}
        imageAlign="right"
        bgColor="bg-[#EAEAEA]"
        href="/product?category=borka"
       />

      {/* 7. Prayer Set — image left */}
      {/* <CollectionBanner
        title="HIJAB"
        subtitle="Pure · Serene · Devotion"
        imageUrl={COLLECTION_IMAGES.hijab}
        imageAlign="left"
        bgColor="bg-[#EAF0EE]"
        href="/product?category=hijab"
       /> */}

      {/* 8. Kids Modest Wear — image right */}
      {/* <CollectionBanner
        title="KIDS COLLECTION"
        subtitle="Modest Fashion for Little Ones"
        imageUrl={COLLECTION_IMAGES.kids}
        imageAlign="right"
        bgColor="bg-[#F0EAF5]"
        href="/product?category=kids"
       /> */}

      {/* Footer */}
      <Footer  />
    </div>
  );
}