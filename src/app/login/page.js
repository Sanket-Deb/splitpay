"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { supabase } from "@/lib/supabase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //for signin with email-password
  const handleLogin = async () => {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/home",
    });
  };

  //for signin with google
  const handleGoogleSignIn = async () => {
    await signIn("google", { redirect: true, callbackUrl: "/home" });
  };

  //for new user registration
  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) console.log(error.message);
  };

  return (
    <div>
      <h2> Login / Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      <button onClick={handleSignUp}>Sign up</button>
    </div>
  );
};

export default LoginPage;
