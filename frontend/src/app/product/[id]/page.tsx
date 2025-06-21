// Force dynamic rendering — ensures metadata runs server-side every time
export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Metadata, ResolvingMetadata } from "next";
import ProductClientComponent from "@/components/ProductClientComponent";

// ✅ Required for dynamic routes in Next.js 15 — tells Next.js this route uses runtime params
export async function generateStaticParams() {
  return [];
}

// ✅ Metadata function must use params as a Promise
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { id } = await params;

    const res = await fetch(
      `https://jalev1.onrender.com/product/list/?product=${encodeURIComponent(
        id
      )}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error(`Metadata fetch failed with status ${res.status}`);
      return {
        title: "Product not found",
        description: "This product is unavailable on Jale.",
      };
    }

    const product = await res.json();

    const productName = product.name || "Product";
    const productPrice = product.price || "0";
    const productImage = product.image || "";
    const imageUrl = productImage.startsWith("http")
      ? productImage
      : `https://jalev1.onrender.com${productImage}`;

    return {
      title: productName,
      description: `Get this product - ${productName} on Jale for ₦${productPrice}`,
      openGraph: {
        title: productName,
        description: `Buy ${productName} for ₦${productPrice} on Jale.`,
        images: [{ url: imageUrl, width: 1200, height: 630 }],
        type: "website",
        siteName: "Jale",
      },
      twitter: {
        card: "summary_large_image",
        title: productName,
        description: `Buy ${productName} for ₦${productPrice} on Jale.`,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return {
      title: "Jale - Online Shopping",
      description: "Shop the best products on Jale.",
      openGraph: {
        title: "Jale - Online Shopping",
        description: "Shop the best products on Jale.",
        images: ["https://jalev1.vercel.app/jalecover.jpg"],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Jale - Online Shopping",
        description: "Shop the best products on Jale.",
        images: ["https://jalev1.vercel.app/jalecover.jpg"],
      },
    };
  }
}

// ✅ Page component: `params` is a plain object here, not a Promise
export default function ProductPage() {
  return <ProductClientComponent />;
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
