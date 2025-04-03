import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { loginUser, getUserProfile } from "@/lib/auth";
import { signIn } from "next-auth/react";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const result = await loginUser(credentials.email, credentials.password);
        if (!result.success) return null;

        //get additional user profile data
        const porfileResult = await getUserProfile(result.user.id);

        return {
          id: result.user.id,
          email: result.user.email,
          name: porfileResult.success ? porfileResult.profile.name : null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      //handle google sign-in
      if (account.provide === "google") {
        // check if user exists in supabase
        const { data: existingUser } = await supabaseAdmin
          .from("profiles")
          .select("*")
          .eq("email", user.email)
          .single();

        if (!existingUser) {
          //create new user in supabase profiles table
          try {
            //first, check if they exist in auth
            const { data: authUser } =
              await supabaseAdmin.auth.admin.getUserByEmail(user.email);

            let userId = authUser?.id;

            //if not in auth, create new
            if (!userId) {
              const { data: newAuthUser } =
                await supabaseAdmin.auth.admin.createUser({
                  email: user.email,
                  email_confirmed: true,
                });
              userId = newAuthUser.id;
            }

            //create profile
            await supabaseAdmin.from("profiles").insert([
              {
                id: userId,
                email: user.email,
                name: user.name,
              },
            ]);
          } catch (error) {
            console.error("Error creating user profiles:", error);
          }
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
