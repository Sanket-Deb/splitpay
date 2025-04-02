"use client";

import { signOut, useSession } from "next-auth/react";

const HomePage = () => {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <h2>Welcome, {session.user.email}</h2>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HomePage;
