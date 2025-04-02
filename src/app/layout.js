"use client";

import { SessionProvider } from "next-auth/react";

const Layout = ({ children }) => <SessionProvider>{children}</SessionProvider>;

export default Layout;
