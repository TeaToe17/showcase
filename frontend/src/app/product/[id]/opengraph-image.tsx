import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Product Image"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

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

export default async function Image({ params }: { params: { id: string } }) {
  // Fetch product data
  const res = await fetch(`https://jalev1.onrender.com/product/list/${params.id}/`)
  const product: Product = await res.json()

  // Ensure we have a valid absolute URL for the image
  const imageUrl =
    product.image && product.image.trim() !== ""
      ? product.image.startsWith("http")
        ? product.image
        : `https://jalev1.onrender.com${product.image}`
      : "https://jale.vercel.app/placeholder.png"

  console.log("Using image URL:", imageUrl)

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        fontSize: 32,
        fontWeight: 600,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: 20,
          padding: 40,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          width: "90%",
          height: "80%",
        }}
      >
        {/* Product Image */}
        <div
          style={{
            display: "flex",
            width: "40%",
            height: "100%",
            marginRight: 40,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 15,
            }}
            crossOrigin="anonymous"
          />
        </div>

        {/* Product Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "60%",
            height: "100%",
            paddingLeft: 20,
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "#1c2b3a",
              marginBottom: 20,
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </div>

          <div
            style={{
              fontSize: 36,
              color: "#EF4444",
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            ₦{product.price.toLocaleString()}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 20,
            }}
          >
            {product.negotiable && (
              <div
                style={{
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  padding: "8px 16px",
                  borderRadius: 20,
                  fontSize: 20,
                }}
              >
                Negotiable
              </div>
            )}
            {product.used && (
              <div
                style={{
                  backgroundColor: "#dbeafe",
                  color: "#1e40af",
                  padding: "8px 16px",
                  borderRadius: 20,
                  fontSize: 20,
                }}
              >
                Used
              </div>
            )}
            {!product.sold && product.stock > 0 && (
              <div
                style={{
                  backgroundColor: "#dcfce7",
                  color: "#166534",
                  padding: "8px 16px",
                  borderRadius: 20,
                  fontSize: 20,
                }}
              >
                In Stock
              </div>
            )}
          </div>

          <div
            style={{
              fontSize: 24,
              color: "#6b7280",
              fontWeight: 500,
            }}
          >
            Available on Jale
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
