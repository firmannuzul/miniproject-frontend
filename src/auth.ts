// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// // export const GET = authConfig.handlers.GET;
// // export const POST = authConfig.handlers.POST

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name: string;
//       email: string;
//       accessToken: string;
//     };
//   }
// }

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   trustHost: true,
//   providers: [
//     Credentials({
//       async authorize(user) {
//         if (!user) return null;
//         return user;
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 2 * 60 * 60, // 2 hours
//   },
//   callbacks: {
//     async signIn() {
//       return true;
//     },
//     async jwt({ token, user }) {
//       if (user) token.user = user;
//       return token;
//     },
//     async session({ session, token }: any) {
//       if (token.user) session.user = token.user;
//       return session;
//     },
//   },

// });

// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";

// /* =======================
//    TYPE AUGMENTATION
// ======================= */

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name: string;
//       email: string;
//       role: "CUSTOMER" | "ORGANIZER";
//       accessToken: string;
//     };
//   }
// }

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name: string;
//       email: string;
//       role: "CUSTOMER" | "ORGANIZER";
//       accessToken: string;
//     };
//   }
// }

// /* =======================
//    NEXTAUTH CONFIG
// ======================= */

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   trustHost: true,

//   providers: [
//     Credentials({
//       name: "Credentials",
//       credentials: {},
//       async authorize(user) {
//         // user berasal dari signIn("credentials", {...})
//         if (!user) return null;
//         return user as any;
//       },
//     }),
//   ],

//   pages: {
//     signIn: "/login",
//   },

//   session: {
//     strategy: "jwt",
//     maxAge: 2 * 60 * 60, // 2 jam
//   },

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.user = user as any;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       session.user = token.user as any;
//       return session;
//     },
//   },
// });


import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "CUSTOMER" | "ORGANIZER";
      accessToken: string;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,

  providers: [
    Credentials({
      async authorize(user) {
        if (!user) return null;
        return user as any;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as any;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
});
