import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Join Our Platform - Special Invitation"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f1ed",
        backgroundImage: "linear-gradient(45deg, #fcecd8 0%, #1c2b3a 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "60px",
          margin: "40px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            backgroundColor: "#1c2b3a",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "60px",
              color: "white",
            }}
          >
            🎁
          </div>
        </div>

        <div
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#1c2b3a",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          You're Invited!
        </div>

        <div
          style={{
            fontSize: "24px",
            color: "#6b7280",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Join our amazing platform and get exclusive benefits
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            backgroundColor: "#f3f4f6",
            borderRadius: "12px",
            padding: "20px 30px",
          }}
        >
          <div style={{ fontSize: "20px" }}>✨</div>
          <div style={{ fontSize: "18px", color: "#374151" }}>Special invitation • Exclusive perks • Join now</div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}