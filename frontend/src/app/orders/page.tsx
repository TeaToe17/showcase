"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  MessageCircle,
  Calendar,
  DollarSign,
  Eye,
  User,
  Hash,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from "lucide-react";

import api from "@/lib/api";

interface Order {
  id: number;
  product: number;
  buyer_name: string;
  buyer_whatsapp_contact: string;
  buyer_call_contact?: string;
  agreed_price?: number;
  quantity: number;
  date_created: string;
  completed: boolean;
  product_name: string;
  product_image: string;
  product_price: number;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter()

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("order/list/");
      setOrders(response.data);
      setError("");
    } catch (err: any) {
      console.error("Error loading orders:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load orders"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(""), 3000);
  };

  const getStatusIcon = (completed: boolean) => {
    return completed ? (
      <CheckCircle size={16} className="text-green-500" />
    ) : (
      <Clock size={16} className="text-yellow-500" />
    );
  };

  const getStatusColor = (completed: boolean) => {
    return completed
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openWhatsApp = (contact: string, orderDetails: Order) => {
    const message = `Hello! I'm ${
      orderDetails.buyer_name
    } and texting regarding Order #${orderDetails.id} for ${
      orderDetails?.product_name || "your product"
    }`;
    window.open(
      `https://wa.me/${contact.replace(/\D/g, "")}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  const callBuyer = (contact: string) => {
    window.open(`tel:${contact}`, "_self");
  };

  // Group orders by date for better organization
  const groupOrdersByDate = (orders: Order[]) => {
    const grouped = orders.reduce((acc, order) => {
      const date = new Date(order.date_created).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(order);
      return acc;
    }, {} as Record<string, Order[]>);

    return Object.entries(grouped).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
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
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] p-3 rounded-lg">
            <Package size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1c2b3a]">My Orders</h1>
            <p className="text-gray-600">
              {orders.length > 0
                ? `${orders.length} order${orders.length > 1 ? "s" : ""} found`
                : "No orders yet"}
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
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            {groupOrdersByDate(orders).map(([date, dayOrders]) => (
              <div key={date}>
                <h2 className="text-lg font-semibold text-[#1c2b3a] mb-4 flex items-center gap-2">
                  <Calendar size={18} />
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>

                <div className="space-y-4">
                  {dayOrders.map((order, index) => (
                    <motion.div
                      onClick={()=>router.push(`/product/${order.product}`)}
                      key={order.id}
                      variants={itemVariants}
                      whileHover={{
                        y: -2,
                        boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all"
                    >
                      {/* Order Header */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Hash size={16} className="text-gray-400" />
                              <span className="font-semibold text-[#1c2b3a]">
                                {order.id}
                              </span>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                order.completed
                              )}`}
                            >
                              <span className="flex items-center gap-1">
                                {getStatusIcon(order.completed)}
                                {order.completed ? "Completed" : "Pending"}
                              </span>
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(order.date_created)}
                          </div>
                        </div>

                        {/* Product & Buyer Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Product Details */}
                          <div className="flex gap-4">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={
                                  order?.product_image ||
                                  "/placeholder.svg?height=80&width=80"
                                }
                                alt={order?.product_name || "Product"}
                                fill
                                style={{ objectFit: "cover" }}
                                className="transition-transform hover:scale-110 duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-[#1c2b3a] text-lg mb-1 truncate">
                                {order?.product_name ||
                                  `Product #${order.product}`}
                              </h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>Quantity: {order.quantity}</p>
                                <p>
                                  Original Price: ₦
                                  {(order?.product_price || 0).toLocaleString()}
                                </p>
                                {order.agreed_price && (
                                  <p className="font-medium text-green-600">
                                    Agreed Price: ₦
                                    {order.agreed_price.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="p-6 bg-gray-50 border-t">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                openWhatsApp("2347046938727", order)
                              }
                              className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors"
                            >
                              <MessageCircle size={14} />
                              WhatsApp
                            </motion.button>

                            {order.buyer_call_contact && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  callBuyer(order.buyer_call_contact!)
                                }
                                className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
                              >
                                <Phone size={14} />
                                Call
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          /* Empty Orders State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-12 text-center"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="bg-gray-100 rounded-full p-6 mb-6">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-500 mb-8 max-w-md">
                You haven't received any orders yet. Share your products to
                start getting orders!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/myproducts")}
                className="bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] hover:opacity-90 text-white px-8 py-3 rounded-lg shadow-sm transition-all flex items-center gap-2 font-semibold"
              >
                <Package size={20} />
                <span>Manage Products</span>
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Orders;
