"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context";
import { motion } from "framer-motion";
import { LogIn, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ACCESS_TOKEN } from "@/lib/constant";

const Logout = () => {
  const { setIsLoggedIn, isLoggedIn } = useAppContext();
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Clear localStorage and update app context
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    setIsLoggedIn(false);
  }, []);

  // Set up countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Clean up timer on unmount
    return () => clearInterval(timer);
  }, []);

  // Handle redirect when countdown reaches zero
  useEffect(() => {
    if (countdown <= 0) {
      setIsRedirecting(true);
      // Use setTimeout to avoid state updates during rendering
      setTimeout(() => {
        router.push("/login");
      }, 0);
    }
  }, [countdown, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8f9fa] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-md"
      >
        <div className="bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a]/10 p-6 flex justify-center">
          <div className="bg-white/90 rounded-full p-4 shadow-md">
            {!isLoggedIn ? (
              <AlertCircle size={40} className="text-yellow-500" />
            ) : (
              <CheckCircle size={40} className="text-green-500" />
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 text-center">
          <h1 className="text-2xl font-bold text-[#1c2b3a] mb-4">
            {!isLoggedIn ? "Already Logged Out" : "Successfully Logged Out"}
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for using Jàle. You have been securely logged out of your account.
          </p>

          <div className="mb-6 bg-[#f8f9fa] rounded-lg p-4 flex flex-col items-center">
            {isRedirecting ? (
              <div className="flex items-center gap-2 text-[#1c2b3a]">
                <Loader2 size={20} className="animate-spin" />
                <span>Redirecting to login page...</span>
              </div>
            ) : (
              <div className="text-[#1c2b3a]">
                <span>Redirecting in </span>
                <motion.span
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-bold inline-block bg-[#1c2b3a] text-white rounded-full w-8 h-8 leading-8 mx-1"
                >
                  {countdown}
                </motion.span>
                <span> seconds</span>
              </div>
            )}
          </div>

          <Link href="/login" className="block w-full">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <LogIn size={18} />
              Login Again
            </motion.button>
          </Link>

          <p className="mt-6 text-sm text-gray-500">
            Need help?{" "}
            <a href="/contact" className="text-[#1c2b3a] hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Logout;
