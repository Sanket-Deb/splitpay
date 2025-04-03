import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { loginUser, getUserProfile } from "@/lib/auth";

const authOptions = {
  debug: true, // for detailed logs in the server terminal
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
        // Get additional user profile data
        const profileResult = await getUserProfile(result.user.id);
        return {
          id: result.user.id,
          email: result.user.email,
          name: profileResult.success ? profileResult.profile.name : null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Log the signIn callback data for debugging
      console.log("signIn callback triggered", { user, account });
      if (account && account.provider === "google") {
        try {
          // Check for an existing profile using maybeSingle() to avoid errors if not found
          const { data: existingUser, error: selectError } = await supabaseAdmin
            .from("profiles")
            .select("*")
            .eq("email", user.email)
            .maybeSingle();

          if (selectError) {
            console.error("Error selecting profile:", selectError);
          }

          if (existingUser) {
            console.log("Profile already exists for", user.email);
            // preserve the original name from registration if it exists in the table
            user.name = existingUser.name;
          } else {
            // No profile exists—retrieve or create the corresponding Supabase auth user
            // Use listUsers to try to find the auth user by email
            const { data: userList, error: listError } =
              await supabaseAdmin.auth.admin.listUsers({
                query: user.email,
              });
            if (listError) {
              console.error("Error listing users:", listError);
              return false;
            }
            let authUser = userList?.users?.find(
              (u) => u.email.toLowerCase() === user.email.toLowerCase()
            );
            let supabaseUserId;
            if (!authUser) {
              //create the auth user if not found
              const { data, error: createError } =
                await supabaseAdmin.auth.admin.createUser({
                  email: user.email,
                  email_confirm: true,
                });
              if (createError) {
                console.error("Error creating auth user:", createError);
                return false;
              }
              //depending on the reponse structure, the new user id might be in data.user or data
              const newUser = data?.user || data;
              if (!newUser || !newUser.id) {
                console.error("Error: new auth user does not have an id", data);
                return false;
              }
              supabaseUserId = newUser.id;
              console.log("Created new Supabase auth user:", supabaseUserId);
            } else {
              supabaseUserId = authUser.id;
              console.log("Found existing Supabase auth user:", supabaseUserId);
            }

            //create the profile using the correct UUID
            const { error: insertError } = await supabaseAdmin
              .from("profiles")
              .insert([
                {
                  id: supabaseUserId,
                  email: user.email,
                  name: user.name,
                },
              ]);
            if (insertError) {
              console.error("Error inserting profile:", insertError);
              return false;
            } else {
              console.log("Profile successfully created for", user.email);
            }
          }
        } catch (err) {
          console.error("Unexpected error in signIn callback:", err);
          return false;
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
