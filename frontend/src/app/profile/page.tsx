"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchUser, fetchCategories } from "@/lib/utils"
import api from "@/lib/api"
import Image from "next/image"
import { motion } from "framer-motion"
import { Edit, Save, Loader2 } from "lucide-react"

interface CustomUser {
  id: number
  name: string
  whatsapp: string
  call: string
  image: string
  email: string
  categories: number[]
}

const Profile = () => {
  const router = useRouter()
  const [user, setUser] = useState<CustomUser | null>(null)
  const [username, setUsername] = useState<string>("")
  const [whatsapp, setWhatsapp] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [call, setCall] = useState<string>("")
  const [editMode, setEditMode] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [categoryNames, setCategoryNames] = useState<{ [key: number]: string }>({})

  const handleEdit = () => {
    if (!user) return
    setEditMode(true)
    setUsername(user.name)
    setWhatsapp(user.whatsapp)
    setCall(user.call)
    setEmail(user.email)
    setSelectedCategories(user.categories || [])
  }

  const resetForm = () => {
    setEditMode(false)
    setUsername("")
    setWhatsapp("")
    setCall("")
    setEmail("")
    setSelectedCategories([])
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("username", username)
    formData.append("email", email)
    formData.append("whatsapp", whatsapp)
    formData.append("call", call)
    selectedCategories.forEach((category) => {
      formData.append("categories", category.toString())
    })

    try {
      await api.put(`user/update_user/${user.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      alert("Profile updated successfully! You will be redirected to login again.")
      resetForm()
      router.push("/logout")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Simplified loadUser function - we're rendering immediately even if data isn't loaded yet
  const loadUser = async () => {
    try {
      const data = await fetchUser()
      setUser(data)
    } catch (err) {
      console.error("Failed to load user:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data:{id:number,name:string}[] = await fetchCategories()
      setCategories(data)

      // Create a map of category IDs to names
      const nameMap: { [key: number]: string } = {}
      data.forEach((cat) => {
        nameMap[cat.id] = cat.name
      })
      setCategoryNames(nameMap)
    } catch (err: any) {
      console.error("Failed to load categories:", err)
    }
  }

  // Simplified useEffect - just load the data on mount
  useEffect(() => {
    loadUser()
    loadCategories()
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f4f1ed] p-5">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
            <span className="ml-2 text-gray-500">Loading...</span>
          </div>
        ) : user ? (
          <>
            <div className="flex justify-end mb-2">
              {!editMode && (
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-[#1c2b3a] text-white rounded-md flex items-center gap-1 hover:opacity-90 transition-opacity"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {!editMode ? (
              <>
                <h1 className="text-center text-2xl font-bold text-gray-900 mb-4">{user.name}</h1>
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                    {user?.image && user.image !== "null" && user.image !== "undefined" ? (
                      <Image
                        src={user.image || "/placeholder.svg"}
                        alt="Profile"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a]/20 overflow-hidden">
                        <Image
                          src="/dp.jpg"
                          alt="Profile"
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="flex justify-between">
                    <strong>WhatsApp:</strong> <span>{user.whatsapp}</span>
                  </p>
                  <p className="flex justify-between">
                    <strong>Call:</strong> <span>{user.call}</span>
                  </p>
                  <p className="flex justify-between">
                    <strong>Email:</strong> <span>{user.email}</span>
                  </p>
                </div>

                <div className="mt-4">
                  <p className="font-semibold mb-2">Categories of Interest:</p>
                  <div className="flex flex-wrap gap-2">
                    {user.categories?.map((categoryId) => (
                      <span
                        key={categoryId}
                        className="bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] text-white px-3 py-1 rounded-full text-sm"
                      >
                        {categoryNames[categoryId] || `Category ${categoryId}`}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-4">
                <h2 className="text-xl font-bold text-center mb-4">Edit Profile</h2>
                <form onSubmit={updateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c2b3a] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <input
                      type="text"
                      placeholder="WhatsApp number"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c2b3a] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      placeholder="Phone number"
                      value={call}
                      onChange={(e) => setCall(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c2b3a] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c2b3a] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categories of Interest</label>
                    <select
                      multiple
                      value={selectedCategories.map(String)}
                      onChange={(e) =>
                        setSelectedCategories(Array.from(e.target.selectedOptions).map((opt) => Number(opt.value)))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c2b3a] focus:border-transparent min-h-[100px]"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple categories</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] text-white rounded-md hover:opacity-90 transition-colors flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-red-500 mb-4">Failed to load profile data.</p>
            <button
              onClick={loadUser}
              className="px-4 py-2 bg-[#1c2b3a] text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
