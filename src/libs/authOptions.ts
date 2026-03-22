import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserLogin from "@/libs/userLogIn";
import getUserProfile from "@/libs/getUserProfile";

type BackendUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            email: { label: "Email", type: "email", placeholder: "email"},
            password: { label: "Password",type: "password"}
          },
          async authorize(credentials, _req) {
            // Add logic here to look up the user from the credentials supplied
            if(!credentials) return null

            try {
              const loginResponse = await UserLogin(credentials.email, credentials.password)
              const backendToken = loginResponse.token

              // Backend may only return token from /auth/login, so always fetch full user data from /auth/me
              const profileResponse = await getUserProfile(backendToken)
              const profileData = profileResponse?.data ?? profileResponse
              const backendUser = profileData as BackendUser

              const resolvedId = backendUser?._id ?? backendUser?.id

              if (backendUser && backendToken && resolvedId) {
                // Return user with all profile data from /auth/me
                return {
                  id: resolvedId,
                  _id: resolvedId,
                  name: backendUser.name,
                  email: backendUser.email,
                  role: backendUser.role,
                  token: backendToken,
                  ...backendUser, // Include any additional fields from profile
                }
              }

              // If you return null then an error will be displayed advising the user to check their details.
              return null
            } catch (error) {
              console.error("Credentials authorize failed:", error)
              return null
            }
          }
        })
      ],
    session: { 
        strategy: "jwt"
    },
    callbacks: {
        async jwt({token,user}) {
        if (user) {
          return { ...token, ...user }
        }
        return token
        },
        async session({session, token, user}) {
            session.user = token as any
            return session
        },
    } 
}