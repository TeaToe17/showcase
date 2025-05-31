"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

const ReferralLanding = () => {
  const searchParams = useSearchParams();
  const referrerCode = searchParams.get("ref");
  const [isLoading, setIsLoading] = useState(false);

  const benefits = [
    "Exclusive welcome bonus",
    "Priority customer support",
    "Access to premium features",
    "Special community perks",
  ];

  const handleSignUp = () => {
    setIsLoading(true);
    // Simulate signup process
    setTimeout(() => {
      // Redirect to actual signup with referral code
      window.location.href = `/signup?ref=${referrerCode}`;
    }, 1000);
  };

  return (
    <>
      {referrerCode && (
        <div className="min-h-screen bg-[#f4f1ed] relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#fcecd8]/30 to-[#1c2b3a]/30 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-br from-[#1c2b3a]/20 to-[#fcecd8]/20 rounded-full"
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Sparkles size={16} className="text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  Invited by{" "}
                  <span className="font-bold text-[#1c2b3a]">
                    {referrerCode}
                  </span>
                </span>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Hero Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Welcome to
                    <span className="bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] bg-clip-text text-transparent block">
                      Jále — Buy. Sell. Negotiate.
                    </span>
                    <span className="bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] bg-clip-text text-transparent block">
                      The Real Plug 💫
                    </span>
                  </h1>
                  <br />
                  <p className="text-xl text-gray-600 leading-relaxed">
                    You've been personally invited to join our exclusive
                    community. Get started today and unlock special benefits
                    just for you!
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    What you'll get:
                  </h3>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="bg-green-100 rounded-full p-1">
                          <CheckCircle size={16} className="text-green-600" />
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </motion.div>

              {/* Right Side - Visual */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className="relative">
                  {/* Main Card */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="bg-white rounded-3xl shadow-2xl p-8 relative z-10"
                  >
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#fcecd8] to-[#1c2b3a] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Gift size={40} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Special Invitation
                      </h3>
                      <p className="text-gray-600 mb-6">
                        You've been invited by{" "}
                        <span className="font-semibold text-[#1c2b3a]">
                          {referrerCode}
                        </span>{" "}
                        to join our exclusive community
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="text-2xl font-bold text-gray-900">
                            10K+
                          </div>
                          <div className="text-sm text-gray-600">
                            Happy Users
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="text-2xl font-bold text-gray-900">
                            4.9★
                          </div>
                          <div className="text-sm text-gray-600">
                            User Rating
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="absolute -top-6 -right-6 bg-yellow-400 rounded-full p-4 shadow-lg z-20"
                  >
                    <Star size={24} className="text-yellow-800" />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="absolute -bottom-6 -left-6 bg-blue-400 rounded-full p-4 shadow-lg z-20"
                  >
                    <Users size={24} className="text-blue-800" />
                  </motion.div>

                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fcecd8]/20 to-[#1c2b3a]/20 rounded-3xl blur-3xl scale-110 -z-10" />
                </div>
              </motion.div>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-16 text-center"
            >
              <p className="text-gray-500 mb-6">
                Trusted by thousands of users worldwide
              </p>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReferralLanding;
