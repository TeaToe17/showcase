"use client"

import { useSearchParams } from "next/navigation"
import Form from "@/components/Form"

const FormWrapper = () => {
  const searchParams = useSearchParams()
  const ref = searchParams.get("ref")

  return <Form route={ref ? `/user/create_user/?ref=${ref}` : "/user/create_user/"} method="register" />
}

export default FormWrapper
