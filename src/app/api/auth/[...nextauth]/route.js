import NextAuth from "next-auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Authenticate user using Supabase
        const { email, password } = credentials;
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw new Error(error.message);
        return data.user; //returning authenticated user data
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub; // Attach user ID to session
      return session;
    },
  },
  pages: {
    signIn: "/login", // custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
