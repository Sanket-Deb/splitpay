"use client";

import { SessionProvider } from "next-auth/react";

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <SessionProvider>{children}</SessionProvider>
    </body>
  </html>
);

export default RootLayout;
