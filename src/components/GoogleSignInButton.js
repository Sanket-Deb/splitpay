"use client";

import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/home" })}
      className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
    >
      <span className="mr-2">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="matrix(1, 0, 0, 1, 0, 0)">
            <path
              d="M21.35,11.1H12v3.73h5.51c-0.5,2.39-2.37,3.73-5.51,3.73c-3.35,0-6.07-2.72-6.07-6.07s2.72-6.07,6.07-6.07 c1.5,0,2.85,0.55,3.91,1.46l2.48-2.48C16.97,3.35,14.56,2,12,2C6.48,2,2,6.48,2,12s4.48,10,10,10c5.32,0,9.15-3.51,9.15-8.82 C21.15,12.26,21.28,11.65,21.35,11.1z"
              fill="#4285F4"
            ></path>
          </g>
        </svg>
      </span>
      Sign in with Google
    </button>
  );
}
