"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  Tag,
  Package,
  DollarSign,
} from "lucide-react"

import api from "@/lib/api"
import ProductComponent from "@/components/Product"
import { fetchProducts, fetchCategories, fetchUser } from "@/lib/utils"

interface Product {
  id: number
  name: string
  price: number
  imagefile: File
  image: string
  stock: number
  description: string
  used: boolean
  sold: boolean
  negotiable: boolean
  extra_field: { [key: string]: string }
  categories: { id: number; name: string }[]
}

const MyProducts = () => {
  const router = useRouter()
  const [ownerId, setOwnerId] = useState<number | string>("")
  const [products, setProducts] = useState<Product[]>([])
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [editMode, setEditMode] = useState<boolean>(false)
  const [cKey, setCkey] = useState<string>("")
  const [cValue, setCvalue] = useState<string>("")
  const [editFeatureMode, setEditFeatureMode] = useState<boolean>(false)
  const [oldKey, setOldKey] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { id: paramId } = useParams<{ id: string }>()
  const [requestId, setRequestId] = useState<string | null>(paramId || null)

  // Controlled inputs
  const [name, setName] = useState<string>("")
  const [price, setPrice] = useState<number | string>("")
  const [stock, setStock] = useState<number | string>("")
  const [description, setDescription] = useState<string>("")
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fairlyUsed, setFairlyUsed] = useState<boolean>(false)
  const [negotiable, setNegotiable] = useState<boolean>(false)
  const [extraField, setExtraField] = useState<{ [key: string]: string }>({})

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  // Handle category checkbox change
  const handleCheckboxChange = (id: number) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((catId) => catId !== id) : [...prevSelected, id],
    )
  }

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      const owner_id = ownerId
      if (owner_id) {
        const ProductsData = await fetchProducts(owner_id)
        setProducts(ProductsData)
      }
      setError("")
    } catch (error: any) {
      setError(error.message || "Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const CategoriesData = await fetchCategories()
      setCategories(CategoriesData)
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to load categories")
    }
  }

  const loadUser = async () => {
    try {
      const data = await fetchUser()
      setOwnerId(data.id)
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to load user data")
    }
  }

  useEffect(() => {
    loadProducts()
  }, [ownerId])

  useEffect(() => {
    loadUser()
    loadCategories()
  }, [])

  const showSuccess = (message: string) => {
    setSuccess(message)
    setTimeout(() => setSuccess(""), 3000)
  }

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", price.toString())
    formData.append("stock", stock.toString())
    formData.append("description", description)
    formData.append("used", fairlyUsed.toString())
    formData.append("negotiable", negotiable.toString())
    formData.append("extra_field", JSON.stringify(extraField))
    if (image) formData.append("imagefile", image)
    selectedCategories.forEach((category) => {
      formData.append("categories", category.toString())
    })
    if (requestId) formData.append("request", requestId)

    try {
      await api.post("product/create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      showSuccess("Product added successfully!")
      loadProducts()
      resetForm()
    } catch (error: any) {
      console.error("Error creating product:", error)
      setError(error.response?.data?.message || "Failed to add product")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form fields
  const resetForm = () => {
    setName("")
    setPrice("")
    setImage(null)
    setPreviewUrl(null)
    setStock("")
    setDescription("")
    setFairlyUsed(false)
    setNegotiable(false)
    setExtraField({})
    setSelectedCategories([])
    setRequestId(null)
    setEditMode(false)
    setCkey("")
    setCvalue("")
    setOldKey("")
    setEditFeatureMode(false)
  }

  // Start editing a product
  const startEditProduct = (product: Product) => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setCurrentProduct(product)
    setName(product.name)
    setPrice(product.price)
    setImage(null)
    setPreviewUrl(product.image)
    setStock(product.stock)
    setDescription(product.description)
    setFairlyUsed(product.used)
    setNegotiable(product.negotiable)
    setExtraField(product.extra_field || {})

    // Set selected categories
    const productCategoryIds = product.categories.map((cat) => cat.id)
    setSelectedCategories(productCategoryIds)

    setEditMode(true)
  }

  // Update product
  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (!currentProduct) return

    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", price.toString())
    if (image) formData.append("imagefile", image)
    formData.append("stock", stock.toString())
    formData.append("used", fairlyUsed.toString())
    formData.append("negotiable", negotiable.toString())
    formData.append("description", description)
    formData.append("extra_field", JSON.stringify(extraField))

    selectedCategories.forEach((category) => {
      formData.append("categories", category.toString())
    })

    try {
      await api.put(`product/update/${currentProduct.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      showSuccess("Product updated successfully!")
      loadProducts()
      resetForm()
    } catch (error: any) {
      console.error("Error updating product:", error)
      setError(error.response?.data?.message || "Failed to update product")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete product
  const deleteProduct = async (product: Product) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    setIsLoading(true)
    try {
      await api.delete(`product/delete/${product.id}/`)
      showSuccess("Product deleted successfully!")
      loadProducts()
    } catch (error: any) {
      console.error("Error deleting product:", error)
      setError(error.response?.data?.message || "Failed to delete product")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB")
        return
      }
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleAddOrEditFeature = () => {
    if (cKey && cValue) {
      if (editFeatureMode && oldKey) {
        setExtraField((prev) => {
          const newFields = { ...prev }
          delete newFields[oldKey]
          return { ...newFields, [cKey]: cValue }
        })
      } else {
        setExtraField((prev) => ({
          ...prev,
          [cKey]: cValue,
        }))
      }
      setCkey("")
      setCvalue("")
      setOldKey("")
      setEditFeatureMode(false)
    }
  }

  const editFeature = (key: string, value: string) => {
    setEditFeatureMode(true)
    setCkey(key)
    setCvalue(value)
    setOldKey(key)
  }

  const removeFeature = (key: string) => {
    setExtraField((prev) => {
      const newFields = { ...prev }
      delete newFields[key]
      return newFields
    })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

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
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen px-4 sm:px-8 md:px-16 lg:px-24 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1c2b3a]">{editMode ? "Edit Product" : "Add a Product"}</h1>
          {editMode && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetForm}
              className="mt-2 md:mt-0 flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              <X size={16} />
              <span>Cancel Edit</span>
            </motion.button>
          )}
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

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={editMode ? updateProduct : createProduct}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Name of Product"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c2b3a] focus:border-transparent transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-gray-500" />
                    </div>
                    <input
                      id="price"
                      type="text"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c2b3a] focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Package size={16} className="text-gray-500" />
                    </div>
                    <input
                      id="stock"
                      type="number"
                      placeholder="Quantity"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      required
                      min="0"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c2b3a] focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={fairlyUsed}
                    onChange={(e) => setFairlyUsed(e.target.checked)}
                    className="rounded text-[#1c2b3a] focus:ring-[#1c2b3a]"
                  />
                  <span>Fairly Used</span>
                </label>

                <label className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={negotiable}
                    onChange={(e) => setNegotiable(e.target.checked)}
                    className="rounded text-[#1c2b3a] focus:ring-[#1c2b3a]"
                  />
                  <span>Negotiable</span>
                </label>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Describe your product in detail"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c2b3a] focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${
                            selectedCategories.includes(category.id)
                              ? "bg-[#1c2b3a] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCheckboxChange(category.id)}
                            className="sr-only"
                          />
                          <Tag size={14} />
                          <span>{category.name}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm p-2">Loading categories...</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {previewUrl ? (
                    <div className="relative h-48 w-full">
                      <Image
                        src={previewUrl || "/placeholder.svg"}
                        alt="Product Preview"
                        fill
                        style={{ objectFit: "contain" }}
                        className="rounded-md"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setImage(null)
                          setPreviewUrl(null)
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload an image</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Features</label>
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <div className="max-h-40 overflow-y-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-sm font-medium">Feature</th>
                          <th className="p-2 text-sm font-medium">Value</th>
                          <th className="p-2 text-sm font-medium w-16">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(extraField).length > 0 ? (
                          Object.entries(extraField).map(([key, value]) => (
                            <tr key={key} className="border-t hover:bg-gray-50">
                              <td className="p-2 text-sm">{key}</td>
                              <td className="p-2 text-sm">{value}</td>
                              <td className="p-2 text-sm">
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => editFeature(key, value)}
                                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeFeature(key)}
                                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="p-4 text-center text-gray-500 text-sm">
                              No features added yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t p-3 bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        placeholder="Feature name"
                        type="text"
                        value={cKey}
                        onChange={(e) => setCkey(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c2b3a] focus:border-transparent transition-colors"
                      />
                      <input
                        placeholder="Feature value"
                        type="text"
                        value={cValue}
                        onChange={(e) => setCvalue(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c2b3a] focus:border-transparent transition-colors"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleAddOrEditFeature}
                        disabled={!cKey || !cValue}
                        className={`px-3 py-1.5 rounded-md text-white text-sm flex items-center gap-1 transition-colors ${
                          !cKey || !cValue ? "bg-gray-400 cursor-not-allowed" : "bg-[#1c2b3a] hover:bg-opacity-90"
                        }`}
                      >
                        {editFeatureMode ? (
                          <>
                            <Save size={14} />
                            <span>Update</span>
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            <span>Add</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] hover:opacity-90 text-white px-6 py-3 rounded-md shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{editMode ? "Updating..." : "Adding..."}</span>
              </>
            ) : (
              <>
                {editMode ? <Save size={18} /> : <Plus size={18} />}
                <span>{editMode ? "Update Product" : "Add Product"}</span>
              </>
            )}
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#1c2b3a]">My Products</h2>
            <button
              onClick={loadProducts}
              className="text-[#1c2b3a] hover:text-opacity-70 text-sm font-medium flex items-center gap-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
              <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-200 rounded flex-1"></div>
                    <div className="h-10 bg-gray-200 rounded flex-1"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all"
                >
                  <div className="p-4">
                    <ProductComponent product={product} />
                  </div>

                  {Object.keys(product.extra_field).length > 0 && (
                    <div className="px-4 pb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Features</h3>
                      <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                        <table className="w-full text-left text-sm">
                          <tbody>
                            {Object.entries(product.extra_field).map(([key, value]) => (
                              <tr key={key} className="border-b border-gray-200 last:border-0">
                                <td className="py-1.5 font-medium text-gray-700">{key}</td>
                                <td className="py-1.5 text-gray-600">{String(value)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="flex border-t">
                    <motion.button
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      onClick={() => startEditProduct(product)}
                      className="flex-1 py-3 flex items-center justify-center gap-1 text-yellow-600 hover:text-yellow-700 transition-colors"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </motion.button>
                    <div className="w-px bg-gray-200"></div>
                    <motion.button
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      onClick={() => deleteProduct(product)}
                      className="flex-1 py-3 flex items-center justify-center gap-1 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="flex flex-col items-center justify-center py-6">
                <Package className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Products Yet</h3>
                <p className="text-gray-500 mb-6">
                  You haven't added any products yet. Start by adding your first product above.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] hover:opacity-90 text-white px-6 py-2 rounded-md shadow-sm transition-all flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span>Add Your First Product</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default MyProducts
