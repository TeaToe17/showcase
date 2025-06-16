import ProductClientComponent from "@/components/ProductClientComponent";

// -- Used ONLY for typing generateMetadata
type PageProps = {
  params: {
    id: string;
  };
};

async function getProduct(id: string) {
  const res = await fetch(
    `https://jalev1.onrender.com/product/list/${id}/`, // use a valid absolute endpoint
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Product not found");
  }

  return res.json();
}

// ✅ Use params only here
export async function generateMetadata({ params }: PageProps) {
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

// ✅ No params used here
export default function ProductPage() {
  return <ProductClientComponent />;
}