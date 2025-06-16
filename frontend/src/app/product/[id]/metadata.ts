import type { Metadata } from "next"

interface Product {
  id: number
  name: string
  price: number
  image: string
  stock: number
  used: boolean
  sold: boolean
  negotiable: boolean
  categories: number[]
  owner: number
  reserved: boolean
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const res = await fetch(`https://jalev1.onrender.com/product/list/${params.id}/`)
  const product: Product = await res.json()

  // Ensure we have a valid absolute URL for the image
  const hasValidImage = typeof product.image === "string" && product.image.trim() !== ""
  let imageUrl = "https://jale.vercel.app/jalecover.jpg" // fallback

  const pageUrl = `https://jale.vercel.app/product/${product.id}`

  return {
    title: product.name,
    description: `Buy ${product.name} for ₦${product.price.toLocaleString()} on Jale.`,
    // metadataBase: new URL("https://jale.vercel.app"),
    openGraph: {
      title: product.name,
      description: `Buy ${product.name} on Jale.`,
      url: pageUrl,
      type: "website",
      siteName: "Jale",
      images: [
        {
          url: `${product.image}`,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: `Buy ${product.name} for ₦${product.price.toLocaleString()} on Jale.`,
      images: [imageUrl],
    },
  }
}
