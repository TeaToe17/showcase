import ProductClientComponent from "@/components/ProductClientComponent";

async function getProduct(id: string) {
  const res = await fetch(
    `https://jalev1.onrender.com/product/list/${id}/`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Product not found");
  }

  return res.json();
}

// ✅ Use inline typing here, DO NOT define PageProps manually
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  return {
    title: product.name,
    description: `Get this product - ${product.name} on Jale for ${product.price}`,
    openGraph: {
      images: [product.image],
      title: product.name,
      description: `Get this product - ${product.name} on Jale for ${product.price}`,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: `Get this product - ${product.name} on Jale for ${product.price}`,
      images: [product.image],
    },
  };
}

// ✅ This page no longer takes params because your client component uses useParams
export default function ProductPage() {
  return <ProductClientComponent />;
}
