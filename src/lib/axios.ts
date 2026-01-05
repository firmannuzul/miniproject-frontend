// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL_API,
// });

// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: "http://localhost:8000",
// });

// axiosInstance.interceptors.request.use((config) => {
//   // ⛔ JANGAN DI TOP LEVEL COMPONENT
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("accessToken");

//     console.log("INTERCEPTOR token =", token);

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }

//   return config;
// });




import axios from "axios";
import { getSession } from "next-auth/react";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_API,
});

/**
 * Attach JWT from NextAuth session
 */
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    const token = session?.user?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



// import axios from "axios";
// import { getSession } from "next-auth/react";

// export const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL_API,
// });

// /* =========================
//    AUTO ATTACH TOKEN
// ========================= */
// axiosInstance.interceptors.request.use(
//   async (config) => {
//     const session = await getSession();

//     if (session?.user?.accessToken) {
//       config.headers.Authorization = `Bearer ${session.user.accessToken}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );



// src/lib/axios.ts
// import axios from "axios";
// import { getSession } from "next-auth/react";

// export const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL_API,
//   withCredentials: true,
// });

// axiosInstance.interceptors.request.use(async (config) => {
//   const session = await getSession();

//   if (session?.user?.accessToken) {
//     config.headers.Authorization = `Bearer ${session.user.accessToken}`;
//   }

//   return config;
// });
