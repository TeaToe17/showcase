import ProductClientComponent from "@/components/ProductClientComponent";

interface Product {
  id: number;
  name: string;
  price: number;
  imagefile: File | string;
  image: string;
  stock: number;
  used: boolean;
  sold: boolean;
  negotiable: boolean;
  extra_field: {};
  categories: number[];
  owner: number;
  reserved: boolean;
}

// ✅ Server-side product fetch function
async function getProduct(id: string) {
  const res = await fetch(`http://localhost:8000/product/list/${id}/` || `https://jalev1.onrender.com/product/list/${id}/`, {
    cache: "no-store", // optional: disable caching if products update frequently
  });

  if (!res.ok) {
    throw new Error("Product not found");
  }

  return res.json();
}

// ✅ Dynamically generate meta tags for SEO/social sharing
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return {
    title: product.name,
    description: `Get this product - ${product.name} on Jale for ${product.price}`,
    openGraph: {
      images: [product.image], // must be absolute URL: https://...
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

// ✅ Render the actual product page
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  return <ProductClientComponent />;
}
