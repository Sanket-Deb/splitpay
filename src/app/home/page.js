"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Header from "@/components/Header";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Account Details</h2>
          <p>
            <strong>Email:</strong>
            {session.user.email}
          </p>
          <p>
            <strong>Name:</strong>
            {session.user.name || "N/A"}
          </p>
        </div>
      </main>
    </div>
  );
}
