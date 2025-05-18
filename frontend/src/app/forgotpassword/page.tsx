"use client"

import type React from "react"
import { useState } from "react"
import api from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, AlertCircle, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<string>("")

  const validateEmail = (email: string): boolean => {
    setEmailError("")
    if (!email.trim()) {
      setEmailError("Email is required")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }

    return true
  }

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email before submission
    if (!validateEmail(email)) {
      return
    }

    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("email", email)

    try {
      await api.post("user/password_reset/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // Show success message
      setSuccess(true)
      setEmail("")
    } catch (err: any) {
      console.error("Password reset error:", err)

      if (err.response?.data?.email) {
        // Handle specific email-related errors
        setError(err.response.data.email[0])
      } else if (err.response?.data?.detail) {
        // Handle API detail errors
        setError(err.response.data.detail)
      } else if (err.response?.data) {
        // Handle other API errors
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Failed to send password reset email. Please try again.",
        )
      } else {
        // Handle network or other errors
        setError("Network error. Please check your connection and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8f9fa] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a]/10 p-6">
            <Link href="/login" className="inline-flex items-center text-[#1c2b3a] hover:underline mb-4">
              <ArrowLeft size={16} className="mr-1" />
              <span>Back to Login</span>
            </Link>

            <h1 className="text-2xl font-bold text-[#1c2b3a]">Reset Password</h1>
            <p className="text-gray-600 mt-2">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <div className="p-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle size={18} />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 text-green-700 px-6 py-6 rounded-lg flex flex-col items-center text-center"
                >
                  <div className="bg-green-100 p-3 rounded-full mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
                  <p className="mb-4">
                    We've sent password reset instructions to your email address. Please check your inbox.
                  </p>
                  <p className="text-sm text-green-600">If you don't see the email, check your spam folder.</p>

                  <button
                    onClick={() => {
                      setSuccess(false)
                      setEmail("")
                    }}
                    className="mt-6 text-[#1c2b3a] hover:underline text-sm font-medium"
                  >
                    Send another email
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={sendEmail} className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (emailError) validateEmail(e.target.value)
                        }}
                        className={`w-full pl-10 pr-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c2b3a] transition-colors ${
                          emailError ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Reset Password</span>
                    )}
                  </motion.button>
                </form>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Remember your password?{" "}
                <Link href="/login" className="text-[#1c2b3a] font-medium hover:underline">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword