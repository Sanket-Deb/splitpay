"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/home"); //redirect to home if already signed in
    }
  }, [session, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Sign in to SplitPay</h1>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  );
};

export default LoginPage;
