"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";

export default function Login() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>loading...</p>;
  }

  if (session) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <AuthForm />
    </div>
  );
}
