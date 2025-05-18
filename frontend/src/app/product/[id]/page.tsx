"use client";

import api from "@/lib/api";
import { useAppContext } from "@/context";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  fetchCategories,
  fetchProducts,
  fetchUser,
  getDecodedToken,
} from "@/lib/utils";
import { Home, ArrowLeft, Heart, Share2 } from "lucide-react";
import { ACCESS_TOKEN } from "@/lib/constant";
import Link from "next/link";
import { motion } from "framer-motion";

interface CustomUser {
  id: number;
  name: string;
  whatsapp: string;
  call: string;
  image: string;
  categories: number[];
}

interface DecodedToken {
  CustomUser: CustomUser;
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
  user_id: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  imagefile: File | string;
  image: string;
  stock: number;
  description: string;
  used: boolean;
  sold: boolean;
  negotiable: boolean;
  extra_field: {};
  categories: number[];
  owner: number;
}

const ProductDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { setUrl, setCurrentProduct } = useAppContext();
  const [categories, setCategories] =
    useState<{ id: number; name: string }[]>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadProducts = async () => {
        setIsLoading(true);
        try {
          const res: Product[] = await fetchProducts();
          if (res) {
            const product = res.find((b) => b.id === Number(id));
            setProduct(product || null);
          }
        } catch (error) {
          console.log("Error fetching product details:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadProducts();
    }
  }, [id]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const CategoriesData = await fetchCategories();
        setCategories(CategoriesData);
      } catch (err: any) {
        setError(err.message);
        console.log(err.message);
      }
    };

    loadCategories();
  }, []);

  const HandleOrder = async () => {
    try {
      const user: CustomUser = await fetchUser();
      if (!user) {
        alert("Invalid user information. Please log in again.");
        setUrl(pathname);
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("product", product?.id?.toString() ?? "Missing Book ID");
      formData.append("buyer_name", user.name ?? "Missing Name");
      formData.append(
        "buyer_whatsapp_contact",
        user.whatsapp ?? "Missing WhatsApp"
      );
      formData.append("buyer_call_contact", user.call ?? "Missing Call");

      try {
        console.log(formData);
        await api.post("order/create/", formData);
        alert("Order successfully placed!");
        router.push(
          `https://wa.me/2347046938727?text=Hello%20I%20am%20${encodeURIComponent(
            user.name
          )},%0AI%20just%20placed%20an%20order%20for%20${encodeURIComponent(
            product?.name ?? ""
          )}%20(${product?.id})`
        );
      } catch (apiError) {
        console.error("API Error:", apiError);
        alert("Error placing the order. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error in HandleOrder:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const HandleNegotiation = (receiverId: number) => {
    console.log(product, receiverId);
    if (product && receiverId) {
      setCurrentProduct(product);
      router.push(`/chat/${receiverId}`);
    }
  };

  if (!id) {
    return <p>Loading ID...</p>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1c2b3a]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] p-8 text-red-500">{error}</div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] p-8">
        <p>Product not found</p>
        <Link
          href="/"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-4 sm:px-8 md:px-16 lg:px-32 py-10">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-[#fcecd8] to-[#1c2b3a] p-2 rounded-full text-white shadow-md"
            >
              <Home size={20} />
            </motion.div>
          </Link>
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#1c2b3a] hover:underline"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Back</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Heart size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Share2 size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Image Gallery Section - Puzzle Layout */}
          <div className="lg:w-1/2 p-4">
            <div className="grid grid-cols-3 gap-2 h-[400px] md:h-[500px]">
              {/* Main large image - takes up 2 rows and 2 columns */}
              <div className="col-span-2 row-span-3 relative rounded-lg overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 66vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Three smaller images stacked vertically */}
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src={
                    product.image ? product.image + "?v=1" : "/placeholder.svg"
                  }
                  alt={`${product.name} view 1`}
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  className="object-cover"
                />
              </div>

              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src={
                    product.image ? product.image + "?v=2" : "/placeholder.svg"
                  }
                  alt={`${product.name} view 2`}
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  className="object-cover"
                />
              </div>

              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src={
                    product.image ? product.image + "?v=3" : "/placeholder.svg"
                  }
                  alt={`${product.name} view 3`}
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:w-1/2 p-6 lg:p-8">
            <div className="space-y-4">
              {/* Product badges */}
              <div className="flex flex-wrap gap-2 mb-2">
                {product.negotiable && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Negotiable
                  </span>
                )}
                {product.used && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Used
                  </span>
                )}
                {!product.sold && product.stock > 0 && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    In Stock
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-[#1c2b3a]">
                {product.name}
              </h1>

              <p className="text-[#EF4444] text-2xl font-semibold">
                ₦{product.price.toLocaleString()}
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">
                  {product.description || "No description available."}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {product.categories
                    .map((categoryId) => {
                      const category = categories?.find(
                        (cat) => cat.id === categoryId
                      );
                      return category ? (
                        <span
                          key={category.id}
                          className="bg-[#1c2b3a]/10 text-[#1c2b3a] px-3 py-1 rounded-full text-sm"
                        >
                          {category.name}
                        </span>
                      ) : null;
                    })
                    .filter(Boolean)}
                </div>
              </div>

              {product.sold ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <span className="font-medium">
                    This product is no longer available
                  </span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={HandleOrder}
                    className="flex-1 bg-gradient-to-r from-[#1c2b3a] to-[#1c2b3a] text-white px-6 py-3 rounded-lg shadow hover:opacity-90 transition-opacity font-medium"
                  >
                    Place Order
                  </motion.button>

                  {product.negotiable && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => HandleNegotiation(product.owner)}
                      className="flex-1 bg-gradient-to-r from-[#fcecd8] to-[#fcecd8] text-[#1c2b3a] px-6 py-3 rounded-lg shadow border border-[#1c2b3a]/20 hover:opacity-90 transition-opacity font-medium"
                    >
                      Negotiate Price
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
