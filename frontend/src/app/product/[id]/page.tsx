// Force this route to be dynamically rendered on each request
export const dynamic = 'force-dynamic';

// Optionally, revalidate every request to prevent caching
export const revalidate = 0;

import type { Metadata } from "next";
import type { ResolvingMetadata } from "next";
import ProductClientComponent from "@/components/ProductClientComponent";

type GenerateMetadataParams = {
  params: Promise<{
    id: string;
  }>;
};

// This forces Next.js to treat this route as dynamic and call generateMetadata at runtime
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(
  { params }: GenerateMetadataParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`https://jalev1.onrender.com/product/list/?product=${id}`, {
      // Force dynamic fetch to avoid build-time issues
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Product metadata fetch failed with status", res.status);
      return {
        title: "Product not found",
        description: "This product is unavailable on Jale.",
      };
    }

    const product = await res.json();

    const imageUrl = new URL(product.image, "https://jalev1.vercel.app/jalecover.jpg").toString();

    return {
      title: product.name,
      description: `Get this product - ${product.name} on Jale for ₦${product.price}`,
      openGraph: {
        title: product.name,
        description: `Buy ${product.name} for ₦${product.price} on Jale.`,
        images: [imageUrl],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: `Buy ${product.name} for ₦${product.price} on Jale.`,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    return {
      title: "Error loading product",
      description: "Something went wrong fetching this product.",
    };
  }
}

// The page component (client-rendered or server-rendered)
export default function ProductPage() {
  return <ProductClientComponent />;
}




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