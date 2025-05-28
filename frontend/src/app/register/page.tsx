"use client";

import React, { Suspense } from "react";
import Form from "../../components/Form";
import ReferralLanding from "@/components/referral-landing";
import { useSearchParams } from "next/navigation";

const FormWrapper = () => {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  return (
    <Form
      route={ref ? `/user/create_user/?ref=${ref}` : "/user/create_user/"}
      method="register"
    />
  );
};

const Register: React.FC = () => {
  return (
    <>
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
          <Suspense fallback={<p>Loading form...</p>}>
            <FormWrapper />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default Register;
