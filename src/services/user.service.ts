import { axiosInstance } from "@/lib/axios";

export const userService = {
  getProfile: async () => {
    const { data } = await axiosInstance.get("/auth/me"); 
    return data;
  },
};