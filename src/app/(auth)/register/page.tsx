import { Metadata } from "next"
import RegisterForm from "@/components/features/auth/register-form"

export const metadata: Metadata = {
    title: "Pendaftaran",
}

export default function RegisterPage() {
    return (
        <RegisterForm />
    )
}
