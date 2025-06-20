import type { Metadata } from "next";
import type { ResolvingMetadata } from "next";
import ProductClientComponent from "@/components/ProductClientComponent";

// ✅ Updated typing for Next.js 15 - params is now a Promise
type GenerateMetadataParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata(
  { params }: GenerateMetadataParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // ✅ Await the params Promise in Next.js 15
  const { id } = await params;

  const res = await fetch(
    `https://jalev1.onrender.com/product/list/?product=${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Product not found");
  }

  console.log(res);
  const product = await res.json();
  console.log(product);

  return {
    title: product.name,
    description: `Get this product - ${product.name} on Jale for ${product.price}`,
    openGraph: {
      images: [product.image],
    },
    twitter: {
      card: "summary_large_image",
      images: [product.image],
    },
  };
}

// ✅ Page component also needs to await params in Next.js 15
export default function ProductPage() {
  return <ProductClientComponent />;
}
