"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import api from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"

const ResetPassword = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const uid = searchParams.get("uid")
  const token = searchParams.get("token")

  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [passwordStrength, setPasswordStrength] = useState<number>(0)
  const [formErrors, setFormErrors] = useState({
    password: "",
    confirmPassword: "",
    general: "",
  })

  // Check if uid and token are present
  useEffect(() => {
    if (!uid || !token) {
      setError("Invalid password reset link. Please request a new one.")
    }
  }, [uid, token])


  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    // Length check
    if (password.length >= 8) strength += 1
    // Contains number
    if (/\d/.test(password)) strength += 1
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1
    // Contains special char
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)
  }, [password])

  const validateForm = () => {
    const errors = {
      password: "",
      confirmPassword: "",
      general: "",
    }
    let isValid = true

    // Password validation
    if (!password) {
      errors.password = "Password is required"
      isValid = false
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters"
      isValid = false
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const sendPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uid || !token) {
      setError("Invalid password reset link. Please request a new one.")
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("password", password)
    formData.append("uid", uid.toString())
    formData.append("token", token.toString())

    try {
      await api.post("user/password_reset/confirm/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // Show success message
      setSuccess(true)
      setPassword("")
      setConfirmPassword("")

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      console.error("Password reset error:", err)

      if (err.response?.data?.password) {
        setFormErrors({
          ...formErrors,
          password: err.response.data.password[0],
        })
      } else if (err.response?.data?.non_field_errors) {
        setError(err.response.data.non_field_errors[0])
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else if (err.response?.data) {
        setError(
          typeof err.response.data === "string" ? err.response.data : "Failed to reset password. Please try again.",
        )
      } else {
        setError("Network error. Please check your connection and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return ""
    if (passwordStrength <= 2) return "Weak"
    if (passwordStrength <= 4) return "Medium"
    return "Strong"
  }

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200"
    if (passwordStrength <= 2) return "bg-red-500"
    if (passwordStrength <= 4) return "bg-yellow-500"
    return "bg-green-500"
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
            <h1 className="text-2xl font-bold text-[#1c2b3a]">Create New Password</h1>
            <p className="text-gray-600 mt-2">Your new password must be different from previously used passwords.</p>
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
                  <h3 className="text-lg font-semibold mb-2">Password Reset Successful</h3>
                  <p className="mb-4">Your password has been reset successfully.</p>
                  <p className="text-sm">You will be redirected to the login page in a few seconds.</p>
                </motion.div>
              ) : (
                <form onSubmit={sendPassword} className="space-y-4">
                  {/* Password field */}
                  <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (formErrors.password) {
                            setFormErrors({ ...formErrors, password: "" })
                          }
                        }}
                        className={`w-full pl-10 pr-10 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c2b3a] transition-colors ${
                          formErrors.password ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}

                    {/* Password strength meter */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">Password strength:</span>
                          <span
                            className={`text-xs font-medium ${
                              passwordStrength <= 2
                                ? "text-red-500"
                                : passwordStrength <= 4
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }`}
                          >
                            {getStrengthLabel()}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                            className={`h-full ${getStrengthColor()}`}
                          ></motion.div>
                        </div>
                        <ul className="mt-2 text-xs text-gray-500 space-y-1">
                          <li className={password.length >= 8 ? "text-green-500" : ""}>• At least 8 characters</li>
                          <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>
                            • At least one uppercase letter
                          </li>
                          <li className={/[a-z]/.test(password) ? "text-green-500" : ""}>
                            • At least one lowercase letter
                          </li>
                          <li className={/\d/.test(password) ? "text-green-500" : ""}>• At least one number</li>
                          <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-500" : ""}>
                            • At least one special character
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password field */}
                  <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          if (formErrors.confirmPassword) {
                            setFormErrors({ ...formErrors, confirmPassword: "" })
                          }
                        }}
                        className={`w-full pl-10 pr-10 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c2b3a] transition-colors ${
                          formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || !uid || !token}
                    className="w-full mt-6 bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </AnimatePresence>

            {!success && (
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Remember your password?{" "}
                  <Link href="/login" className="text-[#1c2b3a] font-medium hover:underline">
                    Back to Login
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ResetPassword
