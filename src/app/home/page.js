"use client";

import { signOut, useSession } from "next-auth/react";

const HomePage = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center mih-h-screen">
      <h1>Welcome to SplitPay, {session?.user?.name}!</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default HomePage;
