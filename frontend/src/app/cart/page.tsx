"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Loader2,
  Package,
  CreditCard,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { useAppContext } from "@/context";
import api from "@/lib/api";
import { fetchUser } from "@/lib/utils";

interface CartItem {
  id: number;
  product: number;
  product_image: string;
  quantity: number;
  product_stock: number;
  product_name?: string;
  product_price?: number;
}

interface CustomUser {
  id: number;
  username: string;
  whatsapp: string;
  call: string;
  image: string;
  email: string;
  referral_points: number;
  categories: number[];
}


const Cart = () => {
  const { cart, setChangedCart, setUrl } = useAppContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter()
  const pathname = usePathname()


  useEffect(() => {
    setIsLoading(true);
    setChangedCart(true);
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading
  }, [setChangedCart]);

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(""), 3000);
  };

  const RemoveItem = async (id: number) => {
    try {
      setIsUpdating(id);
      await api.delete(`order/delete/cartitem/${id.toString()}/`);
      setChangedCart(true);
      showSuccess("Item removed from cart");
    } catch (err) {
      console.error(err);
      showError("Failed to remove item");
    } finally {
      setIsUpdating(null);
    }
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      setIsUpdating(id);
      await api.patch(`order/update/cartitem/${id}/`, {
        quantity: newQuantity,
      });
      setChangedCart(true);
      showSuccess("Quantity updated");
    } catch (err) {
      console.error(err);
      showError("Failed to update quantity");
    } finally {
      setIsUpdating(null);
    }
  };

  const HandleOrder = async () => {
    const productsToSend = cart.map((item) => ({
      product_id: item.product,
      quantity: item.quantity,
    }));
    try {
      setIsCheckingOut(true);
      const user: CustomUser | null = await fetchUser();
      console.log("Fetched user:", user);
      if (!user || !user.id) {
        setUrl(pathname);
        router.push("/login");
        return;
      }

      await api.post("order/create/batchorder/", productsToSend);
      showSuccess("Order placed successfully!");
      setChangedCart(true);
      const productNames = cart.map((item) => item.product_name);
      router.push(
        `https://wa.me/2347046938727?text=Hello%20I%20am%20${encodeURIComponent(
          user.username
        )},%0AI%20just%20placed%20an%20order%20for%20${encodeURIComponent(
          productNames.toString()
        )}`
      );
    } catch (err) {
      console.error(err);
      showError("Failed to place order");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product_price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen px-4 sm:px-8 md:px-16 lg:px-24 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] p-3 rounded-lg">
            <ShoppingCart size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1c2b3a]">Shopping Cart</h1>
            <p className="text-gray-600">
              {cart?.length > 0
                ? `${cart.length} item${
                    cart.length > 1 ? "s" : ""
                  } in your cart`
                : "Your cart is empty"}
            </p>
          </div>
        </div>

        {/* Success message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"
            >
              <CheckCircle size={20} />
              <p>{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
            >
              <AlertCircle size={20} />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          /* Loading State */
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : cart?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-4"
              >
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{
                      y: -2,
                      boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={
                            item.product_image ||
                            "/placeholder.svg?height=80&width=80"
                          }
                          alt={`Product ${item.product}`}
                          fill
                          style={{ objectFit: "cover" }}
                          className="transition-transform hover:scale-110 duration-300"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#1c2b3a] text-lg mb-1 truncate">
                          {item.product_name || `Product ${item.product}`}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          ₦{(item.product_price || 0).toLocaleString()} each
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={
                                item.quantity <= 1 || isUpdating === item.id
                              }
                              className="p-2 text-gray-600 hover:text-[#1c2b3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus size={16} />
                            </motion.button>

                            <div className="px-4 py-2 min-w-[60px] text-center font-medium text-[#1c2b3a]">
                              {isUpdating === item.id ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin mx-auto"
                                />
                              ) : (
                                item.quantity
                              )}
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={
                                item.quantity >= item.product_stock ||
                                isUpdating === item.id
                              }
                              className="p-2 text-gray-600 hover:text-[#1c2b3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus size={16} />
                            </motion.button>
                          </div>

                          <span className="text-xs text-gray-500">
                            {item.product_stock} available
                          </span>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="font-bold text-[#1c2b3a] text-lg">
                            ₦
                            {(
                              (item.product_price || 0) * item.quantity
                            ).toLocaleString()}
                          </p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => RemoveItem(item.id)}
                          disabled={isUpdating === item.id}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {isUpdating === item.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8"
              >
                <h2 className="text-xl font-bold text-[#1c2b3a] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>₦{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-[#1c2b3a]">
                      <span>Total</span>
                      <span>₦{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={HandleOrder}
                  disabled={isCheckingOut}
                  className="w-full bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] hover:opacity-90 text-white px-6 py-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure checkout powered by our platform
                </p>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-12 text-center"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="bg-gray-100 rounded-full p-6 mb-6">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-8 max-w-md">
                Looks like you haven't added any items to your cart yet. Start
                shopping to fill it up!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/orders")}
                className="bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] hover:opacity-90 text-white px-8 py-3 rounded-lg shadow-sm transition-all flex items-center gap-2 font-semibold"
              >
                <ShoppingCart size={20} />
                <span>Your Orders</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;
