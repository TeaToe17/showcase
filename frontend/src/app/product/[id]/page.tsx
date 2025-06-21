import ProductClientComponent from "@/components/ProductClientComponent"
import Head from "next/head"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProductPage({ params }: { params: { id: string } }) {
  const res = await fetch(`https://jalev1.onrender.com/product/list/?product=${encodeURIComponent(params.id)}`, {
    cache: "no-store",
  })

  let product = null
  if (res.ok) {
    product = await res.json()
  }

  const name = product?.name || "Product"
  const price = product?.price || ""
  const image =product?.image || "https://jale.vercel.app/jalecover.jpg"

  return (
    <>
      {/* ✅ Manually inject OG + Twitter meta tags */}
      <Head>
        <title>{name}</title>
        <meta name="description" content={`Buy ${name} for ₦${price} on Jale`} />

        <meta property="og:title" content={name} />
        <meta property="og:description" content={`Buy ${name} for ₦${price} on Jale`} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Jale" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={name} />
        <meta name="twitter:description" content={`Buy ${name} for ₦${price} on Jale`} />
        <meta name="twitter:image" content={image} />
      </Head>

      <ProductClientComponent />
    </>
  )
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

//     const res = await fetch(`https://jalev1.onrender.com/product/list/?product=${encodeURIComponent(id)}`, {
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
