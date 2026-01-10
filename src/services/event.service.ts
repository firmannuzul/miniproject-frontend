import { axiosInstance } from "@/lib/axios";

export const eventService = {
  // Ambil semua event (Public)
  getEvents: async (search?: string, category?: string, location?: string, pageParam: number = 1) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (location) params.append("location", location);

    params.append("page", pageParam.toString());
    params.append("limit", "4");

    const { data } = await axiosInstance.get("/api/events", { params });
    return data;
  },

  // Ambil detail event
  getEventDetail: async (id: number) => {
    const { data } = await axiosInstance.get(`/api/events/${id}`);
    return data;
  },

  // --- TAMBAHKAN FUNGSI BARU DI BAWAH INI ---

  // Ambil data profil Organizer berdasarkan ID
  getOrganizerById: async (id: number) => {
    // Sesuaikan endpoint ini dengan backend kamu, misal /api/users/organizer/1
    const { data } = await axiosInstance.get(`/api/organizers/${id}`); 
    return data;
  },

  // Ambil semua event yang dimiliki oleh Organizer tertentu
  getEventsByOrganizer: async (organizerId: number) => {
  const { data } = await axiosInstance.get(`/api/events`, {
    params: { user_id: organizerId } // Pastikan parameter filternya benar
  });
  return data;
},
};


