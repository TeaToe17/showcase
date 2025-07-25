"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import ReferralLanding from "@/components/referral-landing";
import { Loader2 } from "lucide-react";

const FormWrapper = dynamic(() => import("@/components/Formwrapper"), {
  ssr: false,
});

const Register = () => {
  return (
    <>
      <Suspense
        fallback={<Loader2 size={16} className="animate-spin mx-auto" />}
      >
        <ReferralLanding />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#f4f1ed",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "30px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                color: "#000000",
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              Register
            </h1>
            <FormWrapper />
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default Register;
