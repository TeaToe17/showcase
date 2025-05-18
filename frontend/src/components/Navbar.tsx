"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useGlobalListener } from "@/lib/utils"
import { useAppContext } from "@/context"
import Image from "next/image"
import api, { logout } from "@/lib/api"
import { Menu, X, Home, Inbox, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
  sender_id: number
  receiver_id: number
  text: string
  created_at: string
}

const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { globalMessages, isLoggedIn } = useAppContext()

  useGlobalListener()

  useEffect(() => {
    if (pathname === `chat/${globalMessages?.receiver_id}`) return
    if (globalMessages) {
      const PushMessage = async (msg: Message) => {
        const formData = new FormData()
        formData.append("receiverId", msg.receiver_id.toString())
        formData.append("senderId", msg.sender_id.toString())
        formData.append("message", msg.text)
        try {
          await api.post("user/push_message/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        } catch (error) {
          console.log(error)
        }
      }

      PushMessage(globalMessages)
    }
  }, [globalMessages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navItems = isLoggedIn ? (
    <>
      <NavItem href="/" icon={<Home className="w-5 h-5" />} label="Home" />
      <NavItem href="/requests" label="Requests" />
      <NavItem
        href="/messages"
        icon={<Inbox className="w-5 h-5" />}
        label="Messages"
        onClick={() => router.push("/messages")}
      />
      <li className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-white/10"
        >
          <User className="w-5 h-5" />
          <span className="md:hidden">Account</span>
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-1 bg-white text-black rounded-md shadow-lg py-2 w-40 z-50"
            >
              <DropdownItem
                label="Profile"
                onClick={() => {
                  router.push("/profile")
                  setDropdownOpen(false)
                }}
              />
              <DropdownItem
                label="Logout"
                onClick={() => {
                  logout()
                  setDropdownOpen(false)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    </>
  ) : (
    <>
      <NavItem href="/" icon={<Home className="w-5 h-5" />} label="Home" />
      <NavItem href="/login" label="Login" onClick={() => router.push("/login")} />
      <NavItem href="/register" label="Register" onClick={() => router.push("/register")} />
    </>
  )

  return (
    <nav className="w-full bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="z-10 ml-5">
          <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Image src="/jale logo.png" alt="Jàle Logo" width={40} height={40} className="rounded-full" />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">{navItems}</ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-[30] p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileMenuOpen ? "close" : "open"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-[25] bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] pt-20 px-6"
            >
              <ul className="flex flex-col gap-4 text-base font-medium">{navItems}</ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

// Helper components for cleaner code
const NavItem = ({
  href,
  icon,
  label,
  onClick,
}: {
  href: string
  icon?: React.ReactNode
  label: string
  onClick?: () => void
}) => {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center gap-2 p-2 rounded-md transition-all hover:bg-white/10"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2">
          {icon}
          <span className={icon ? "md:hidden" : ""}>{label}</span>
        </motion.div>
      </Link>
    </li>
  )
}

const DropdownItem = ({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) => {
  return (
    <motion.button
      whileHover={{ backgroundColor: "#f3f4f6" }}
      className="block w-full text-left px-4 py-2"
      onClick={onClick}
    >
      {label}
    </motion.button>
  )
}

export default Navbar
