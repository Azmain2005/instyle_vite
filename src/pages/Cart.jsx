
import React, { useState, useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import PromoBanner from "../components/topBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import Swal from 'sweetalert2';

// ================= CART ITEM =================
const CartItem = ({ item, onDelete, onUpdateQty }) => {

  if (!item) return null;

  const handleDecrease = () => {
    if (item.qty > 1) onUpdateQty(item, item.qty - 1);
  };

  const handleIncrease = () => {
    onUpdateQty(item, item.qty + 1);
  };

  return (
    <div className="flex items-start justify-between border-b border-gray-100 py-6 last:border-b-0">
      <div className="flex items-start space-x-4">

        {/* PRODUCT IMAGE */}
        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name || "Product image"}
              fill
              sizes="96px"
              className="object-cover"
              priority
             />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400 text-[10px] uppercase">
              No Image
            </div>
          )}
        </div>

        {/* PRODUCT DETAILS */}
        <div className="flex flex-col pt-1">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {item.name || "Unnamed Product"}
          </h3>

          <div className="mt-1 space-y-0.5">
            {item.attributes?.map(([key, value]) => (
              <p key={key} className="text-sm text-gray-500">
                {key}: <span className="font-semibold text-gray-700">{value}</span>
              </p>
            ))}
          </div>

          {/* SAFE PRICE RENDERING */}
          <p className="text-xl font-bold mt-3 text-gray-900">
            {Number(item.price || 0).toLocaleString()} TK
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between h-24">
        <button onClick={() => onDelete(item)} className="text-red-500 hover:text-red-700 p-1">
          <Trash2 size={20}  />
        </button>

        <div className="flex items-center space-x-3 border border-gray-200 rounded-full px-3 py-1 bg-gray-50">
          <button onClick={handleDecrease} className="text-gray-600 hover:text-black p-1">
            <Minus size={16}  />
          </button>
          <span className="text-sm font-bold min-w-[20px] text-center">
            {item.qty || 1}
          </span>
          <button onClick={handleIncrease} className="text-gray-600 hover:text-black p-1">
            <Plus size={16}  />
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= MAIN CART PAGE =================
export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    orderNote: "",
    cartId: "",
  });


  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartId = localStorage.getItem("cartId");

        // If no cartId → stop
        if (!cartId) {
          console.log("No cartId in localStorage");
          setLoading(false);
          return;
        }

        // Save cartId to form data state
        setFormData((prev) => ({
          ...prev,
          cartId: cartId
        }));

        // Fetch cart by cartId
        const cartRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/cart/specificcart/${cartId}`
        );

        if (cartRes.status === 200 && cartRes.data.cart) {
          const cart = cartRes.data.cart;

          // Extra safety check: if cart is not in editing mode, it shouldn't be here
          if (cart.cartStatus !== "editing") {
            localStorage.removeItem("cartId");
            setFormData(prev => ({ ...prev, cartId: "" }));
            setCartItems([]);
            setLoading(false);
            return;
          }

          // Format items and calculate the REAL price based on selected attributes
          const formattedItems = cart.products.map((item) => {
            // Default to base selling price (e.g., 649)
            let selectedPrice = item.product.selling;

            // Look inside product.attributes to find the price for the selected value (e.g., "m")
            if (item.attributes && item.product.attributes) {
              // Get the key/value the user picked (e.g., size: "m")
              const selectedEntries = Object.entries(item.attributes);

              if (selectedEntries.length > 0) {
                const [selectedKey, selectedVal] = selectedEntries[0];

                // Find the attribute definition in the product (e.g., the "size" group)
                const productAttr = item.product.attributes.find(
                  (a) => a.title.toLowerCase() === selectedKey.toLowerCase()
                );

                if (productAttr) {
                  // Find the specific value object that matches what was picked
                  const valueObj = productAttr.values.find(
                    (v) => v.val.toLowerCase() === selectedVal.toLowerCase()
                  );

                  // If we found a specific price for this variant, use it!
                  if (valueObj && valueObj.price) {
                    selectedPrice = valueObj.price;
                  }
                }
              }
            }

            return {
              id: item._id,
              productId: item.product._id,
              name: item.product.title,
              image: item.product.photos?.[0] || "/placeholder.png",
              price: selectedPrice, // This is now 24 instead of 649
              qty: item.count,
              attributes: Object.entries(item.attributes || {}),
            };
          });

          setCartItems(formattedItems);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        // If cart doesn't exist anymore or error occurs, clear local reference
        localStorage.removeItem("cartId");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);



  const handleFormFieldChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,      // Copy the old state
      [name]: value     // Overwrite only the field that changed
    }));
  };


  const confirmOrder = async (e) => {
    if (e) e.preventDefault();
    // 1. Basic validation check
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all required shipping details.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    try {
      // 2. Prepare the payload to match your Mongoose Schema
      const orderPayload = {
        cartId: formData.cartId,
        name: formData.name,
        number: formData.phone, // mapping 'phone' from form to 'number' in schema
        address: formData.address,
        city: formData.city,
        orderNote: formData.orderNote || "No note provided",
        orderStatus: "pending",
      };
      // 3. Send the POST request
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/order`, orderPayload);

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Your order has been recorded successfully.',
          timer: 2000 // Automatically closes after 2 seconds
        });

        //update the cart to pending
        updateCartToPending(formData.cartId);

        // 4. Cleanup: Clear local storage and redirect or refresh state
        localStorage.removeItem("cartId");
        setCartItems([]);
        setFormData({
          name: "",
          phone: "",
          address: "",
          city: "",
          orderNote: "",
          cartId: "",
        });
      }
    } catch (err) {
      console.error("Order submission failed:", err);
      alert(err.response?.data?.message || "Failed to place order. Please try again.");
    }
  };


  const updateCartToPending = async (cartid) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/cart/update-status/${cartid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartStatus: "pending" }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update cart status");
      }

      return data; // Return the updated cart data to the UI
    } catch (error) {
      console.error("Cart Update Error:", error.message);
      throw error; // Re-throw so your UI can show an alert/toast
    }
  };


  const handleDeleteItem = async (item) => {
    try {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) return;

      // Convert attributes array back to object
      const attributesObject = Object.fromEntries(item.attributes);

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/cart/deleteproductcart/${cartId}`,
        {
          product: item.productId,
          attributes: attributesObject,
        }
      );

      // ✅ Update UI immediately
      setCartItems((prev) =>
        prev.filter((cartItem) => cartItem.id !== item.id)
      );
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };



  const handleUpdateItemQty = async (item, newQty) => {
    try {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) return;

      const attributesObject = Object.fromEntries(item.attributes);

      // Send PUT request to your editcart endpoint
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/cart/editproductcart/${cartId}`,
        {
          product: item.productId,
          count: newQty, // new quantity
          attributes: attributesObject,
        }
      );

      // Update UI immediately
      setCartItems((prev) =>
        prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, qty: newQty } : cartItem
        )
      );
    } catch (err) {
      console.error("Failed to update item quantity:", err);
    }
  };





  // Inside your CartPage component, before the return:

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Dynamic delivery fee logic
  const getDeliveryFee = () => {
    if (subtotal === 0) return 0;
    if (formData.city === "Inside Dhaka") return 80;
    if (formData.city === "Outside Dhaka") return 150;
    return 150; // Default or fallback fee
  };

  const deliveryFee = getDeliveryFee();
  const total = subtotal + deliveryFee;

  return (
    <>
      <PromoBanner  />
      <Navbar  />

      <div className="container mx-auto px-4 py-10 md:py-16 border-t border-gray-300">
        <h1 className="text-4xl font-extrabold mb-8 md:mb-12 uppercase">Your Cart</h1>

        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-2/3 bg-white p-6 md:p-8 rounded-4xl shadow-lg border border-gray-100">
            {loading ? (
              <p className="text-center py-10">Loading your cart...</p>
            ) : cartItems.length === 0 ? (
              <p className="text-center py-10">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => <CartItem key={item.id} item={item} onDelete={handleDeleteItem} onUpdateQty={handleUpdateItemQty}  />)
            )}
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:w-1/3 mt-8 lg:mt-0 sticky top-4">
            <div className="bg-white p-6 md:p-8 shadow-lg border border-gray-100 rounded-4xl">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{subtotal.toFixed(2)}TK</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">{deliveryFee.toFixed(2)}tk</span>
                </div>
                <div className="border-t border-gray-200 pt-4"></div>
                <div className="flex justify-between text-xl font-extrabold text-gray-900">
                  <span>Total</span>
                  <span>{total.toFixed(2)}TK</span>
                </div>
              </div>
              <button type="button" onClick={confirmOrder} className="w-full mt-6 bg-black text-white font-bold py-4 text-lg hover:bg-gray-800 transition duration-150 rounded-4xl">
                Confirm order
              </button>
            </div>
          </div>
        </div>
      </div>



      <div className="container mx-auto px-4 pb-16">
        <div className="lg:w-2/3 bg-white p-6 md:p-8 rounded-4xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-extrabold mb-8 uppercase tracking-tight">Shipping Details</h2>

          <form className="space-y-6">
            {/* Row 1: Name and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2 ml-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleFormFieldChange}
                 />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2 ml-1">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormFieldChange}
                 />
              </div>
            </div>

            {/* Row 2: Address */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 mb-2 ml-1">Full Address *</label>
              <textarea
                rows="3"
                placeholder="House no, Street name, Area..."
                className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                required
                name="address"
                value={formData.address}
                onChange={handleFormFieldChange}
              ></textarea>
            </div>

            {/* Row 3: City and Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2 ml-1">City / Region *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleFormFieldChange}
                  required
                  className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all appearance-none"
                >
                  <option value="">Select your location</option>
                  <option value="Inside Dhaka">Inside Dhaka (80 TK)</option>
                  <option value="Outside Dhaka">Outside Dhaka (150 TK)</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2 ml-1">Order Note (Optional)</label>
                <input
                  type="text"
                  placeholder="Notes for delivery"
                  className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  name="orderNote"
                  value={formData.orderNote}
                  onChange={handleFormFieldChange}
                 />
              </div>
            </div>

            {/* Payment Method Preview */}
            <div className="pt-4">
              <label className="text-sm font-bold text-gray-700 mb-3 block ml-1">Payment Method</label>
              <div className="flex items-center p-4 border-2 border-black rounded-2xl bg-gray-50">
                <div className="w-4 h-4 rounded-full bg-black mr-3"></div>
                <span className="font-bold text-gray-900">
                  Cash on Delivery: Delivery Charge ({deliveryFee}tk)
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer  />
    < />
  );
}
