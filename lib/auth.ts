
import FacebookProvider from "next-auth/providers/facebook";
import type { NextAuthOptions } from 'next-auth';


export const authOptions:NextAuthOptions = {  
    pages: {
      signIn: "/auth/sign-in",
    },
    providers: [
      FacebookProvider({
        clientId: process.env.AUTH_FACEBOOK_ID!,
        clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
        authorization:{
          url: "https://www.facebook.com/v22.0/dialog/oauth",
          params: { scope: "pages_read_engagement,pages_show_list" },
        }
      }),
    ],
    callbacks: {
      async jwt({ token, account }) {
        if (account) {
          token.accessToken = account.access_token;
        }
        return token;
      },
      async session({ session, token }) {
        //@ts-expect-error
        session.accessToken = token.accessToken; // Ensure session has accessToken
        return session;
      },
     
    },
   }
  
  