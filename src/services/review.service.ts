import { axiosInstance } from "@/lib/axios";

export const reviewService = {
  // Mengambil daftar ulasan berdasarkan ID Event
  getReviewsByEvent: async (eventId: number) => {
    const { data } = await axiosInstance.get(`/api/reviews/event/${eventId}`);
    return data;
  },

  // Mengirim ulasan baru
  createReview: async (payload: { event_id: number; rating: number; comment: string }) => {
    const { data } = await axiosInstance.post("/api/reviews", payload);
    return data;
  },
};