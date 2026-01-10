import { axiosInstance } from "@/lib/axios";

export const eventOrganizerService = {
  // 1. GET MY EVENTS: Mengambil daftar event milik organizer yang login
  getMyEvents: async () => {
    const { data } = await axiosInstance.get("/api/organizer/events");
    return data;
  },

  // 2. CREATE EVENT: Membuat event baru dengan Gambar & JSON Tiket
  createEvent: async (formData: FormData) => {
    // Axios otomatis mengatur 'Content-Type' menjadi 'multipart/form-data' 
    // karena mendeteksi penggunaan FormData.
    const { data } = await axiosInstance.post("/api/organizer/events", formData);
    return data;
  },

  // 3. UPDATE EVENT: Memperbarui data event secara parsial
  updateEvent: async (eventId: number | string, formData: FormData) => {
    const { data } = await axiosInstance.patch(
      `/api/organizer/events/${eventId}`,
      formData
    );
    return data;
  },

  // 4. DELETE EVENT: Menghapus event
  deleteEvent: async (eventId: number | string) => {
    const { data } = await axiosInstance.delete(`/api/organizer/events/${eventId}`);
    return data;
  },

  // 5. GET DETAIL: Mengambil detail event spesifik (untuk kebutuhan edit)
  getEventDetail: async (eventId: number | string) => {
    const { data } = await axiosInstance.get(`/api/organizer/events/${eventId}`);
    return data;
  },
};