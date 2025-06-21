// import type { Metadata } from "next"
import ProductClientComponent from "@/components/ProductClientComponent"

// // Force dynamic rendering
// export const dynamic = "force-dynamic"

// type Props = {
//   params: Promise<{ id: string }>
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   console.log("🔍 generateMetadata called")

//   try {
//     const { id } = await params
//     console.log("📝 Product ID:", id)

//     // Test if we can reach the API at all
//     console.log("🌐 Attempting to fetch from API...")

//     const apiUrl = `https://jalev1.onrender.com/product/list/?product=${id}`
//     console.log("🔗 API URL:", apiUrl)

//     const response = await fetch(apiUrl, {
//       cache: "no-store",
//       headers: {
//         "User-Agent": "NextJS-App/1.0",
//       },
//     })

//     console.log("📊 Response status:", response.status)
//     console.log("📊 Response ok:", response.ok)
//     console.log("📊 Response headers:", Object.fromEntries(response.headers.entries()))

//     if (!response.ok) {
//       console.error("❌ API request failed:", response.status, response.statusText)

//       // Try to read the error response
//       try {
//         const errorText = await response.text()
//         console.error("❌ Error response body:", errorText)
//       } catch (e) {
//         console.error("❌ Could not read error response")
//       }

//       return {
//         title: "Product Not Found",
//         description: "This product could not be loaded.",
//       }
//     }

//     const responseText = await response.text()
//     console.log("📄 Raw response:", responseText.substring(0, 500))

//     let product
//     try {
//       product = JSON.parse(responseText)
//       console.log("✅ Parsed product:", product)
//     } catch (parseError) {
//       console.error("❌ JSON parse error:", parseError)
//       console.error("❌ Response was not valid JSON:", responseText)

//       return {
//         title: "Error Loading Product",
//         description: "Product data could not be parsed.",
//       }
//     }

//     // Validate product structure
//     if (!product || typeof product !== "object") {
//       console.error("❌ Invalid product structure:", typeof product, product)
//       return {
//         title: "Invalid Product Data",
//         description: "Product data is not in expected format.",
//       }
//     }

//     const metadata = {
//       title: product.name || "Product",
//       description: `${product.name || "Product"} - ₦${product.price || "0"} on Jale`,
//       openGraph: {
//         title: product.name || "Product",
//         description: `Buy ${product.name || "this product"} for ₦${product.price || "0"} on Jale`,
//         images: [product.image || "https://jale.vercel.app/jalecover.jpg"],
//       },
//     }

//     console.log("✅ Generated metadata:", metadata)
//     return metadata
//   } catch (error) {
//     console.error("💥 generateMetadata error:", error)
//     console.error("💥 Error stack:", error instanceof Error ? error.stack : "No stack trace")

//     // Return basic fallback metadata
//     return {
//       title: "Jale - Product",
//       description: "Shop products on Jale",
//     }
//   }
// }

export default function ProductPage() {
  return <ProductClientComponent  />
}


// import type { Metadata } from "next"
// import type { ResolvingMetadata } from "next"
// import ProductClientComponent from "@/components/ProductClientComponent"

// // Force this route to be dynamically rendered on each request
// export const dynamic = "force-dynamic"

// type GenerateMetadataParams = {
//   params: Promise<{
//     id: string
//   }>
// }

// export async function generateMetadata(
//   { params }: GenerateMetadataParams,
//   parent: ResolvingMetadata,
// ): Promise<Metadata> {
//   try {
//     const { id } = await params

//     // Add timeout and better error handling
//     const controller = new AbortController()
//     const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

//     const res = await fetch(`https:/.onrender.com/product/list/?product=${encodeURIComponent(id)}`, {
//       cache: "no-store",
//       signal: controller.signal,
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     })

//     clearTimeout(timeoutId)

//     if (!res.ok) {
//       console.error(`Product metadata fetch failed with status ${res.status} for product ID: ${id}`)
//       return {
//         title: "Product not found",
//         description: "This product is unavailable on Jale.",
//       }
//     }

//     const product = await res.json()

//     // Validate the product data
//     if (!product || typeof product !== "object") {
//       console.error("Invalid product data received:", product)
//       return {
//         title: "Product not found",
//         description: "This product is unavailable on Jale.",
//       }
//     }

//     // Safely access product properties with fallbacks
//     const productName = product.name || "Product"
//     const productPrice = product.price || "0"
//     const productImage = product.image

//     // Handle image URL more safely
//     let imageUrl = "https://jalev1.vercel.app/jalecover.jpg" // Default fallback
//     if (productImage) {
//       try {
//         // Check if it's already a full URL
//         if (productImage.startsWith("http")) {
//           imageUrl = productImage
//         } else {
//           // Construct full URL if it's a relative path
//           imageUrl = new URL(productImage, "https://jalev1.onrender.com").toString()
//         }
//       } catch (urlError) {
//         console.error("Error constructing image URL:", urlError)
//         // Keep the default fallback image
//       }
//     }

//     return {
//       title: productName,
//       description: `Get this product - ${productName} on Jale for ₦${productPrice}`,
//       openGraph: {
//         title: productName,
//         description: `Buy ${productName} for ₦${productPrice} on Jale.`,
//         images: [
//           {
//             url: imageUrl,
//             width: 1200,
//             height: 630,
//             alt: productName,
//           },
//         ],
//         type: "website",
//         siteName: "Jale",
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: productName,
//         description: `Buy ${productName} for ₦${productPrice} on Jale.`,
//         images: [imageUrl],
//       },
//     }
//   } catch (error) {
//     console.error("Error in generateMetadata:", error)

//     // Return fallback metadata instead of throwing
//     return {
//       title: "Jale - Online Shopping",
//       description: "Shop the best products on Jale.",
//       openGraph: {
//         title: "Jale - Online Shopping",
//         description: "Shop the best products on Jale.",
//         images: ["https://jalev1.vercel.app/jalecover.jpg"],
//         type: "website",
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: "Jale - Online Shopping",
//         description: "Shop the best products on Jale.",
//         images: ["https://jalev1.vercel.app/jalecover.jpg"],
//       },
//     }
//   }
// }

// // The page component
// export default function ProductPage() {
//   return <ProductClientComponent />
// }

// export const dynamic = 'force-dynamic';

// import type { Metadata } from "next";
// import type { ResolvingMetadata } from "next";
// import ProductClientComponent from "@/components/ProductClientComponent";

// // ✅ Updated typing for Next.js 15 - params is now a Promise
// type GenerateMetadataParams = {
//   params: Promise<{
//     id: string;
//   }>;
// };

// export async function generateMetadata(
//   { params }: GenerateMetadataParams,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   // ✅ Await the params Promise in Next.js 15
//   const { id } = await params;

//   const res = await fetch(
//     `https://jalev1.onrender.com/product/list/?product=${id}`,
//     {
//       cache: "force-cache",
//       // cache: "no-store",
//     }
//   );

//   if (!res.ok) {
//     console.error("Product not found");
//   }

//   console.log(res);
//   const product = await res.json();
//   console.log(product);

//   return {
//     title: product.name,
//     description: `Get this product - ${product.name} on Jale for ${product.price}`,
//     openGraph: {
//       images: [product.image],
//     },
//     twitter: {
//       card: "summary_large_image",
//       images: [product.image],
//     },
//   };
// }

// // ✅ Page component also needs to await params in Next.js 15
// export default function ProductPage() {
//   return <ProductClientComponent />;
// }
