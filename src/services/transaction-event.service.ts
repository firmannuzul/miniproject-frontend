// src/services/transaction-event.service.ts
import { axiosInstance } from "@/lib/axios";

// Tipe data payload untuk create transaction (sesuaikan jika ada field lain)
interface CreateTransactionPayload {
  event_id: number;
  tickets: { ticket_id: number; quantity: number }[];
  voucher_code?: string;
  point_used?: number;
}

export const transactionEventService = {
  // 1. GET HISTORY: Mengambil riwayat transaksi user
  getMyHistory: async () => {
    const { data } = await axiosInstance.get("/transaction-events/me");
    return data;
  },

  // 2. CREATE TRANSACTION: Membuat transaksi baru
  createTransaction: async (payload: CreateTransactionPayload) => {
    const { data } = await axiosInstance.post("/transaction-events", payload);
    return data;
  },

  // 3. UPLOAD PROOF: Upload Bukti Bayar (VERSI PERBAIKAN)
  uploadProof: async (transactionId: number, file: File) => {
    const formData = new FormData();
    
    // PENTING: Key "image" harus sama persis dengan di Router Backend
    // Backend: this.uploader.upload().single("image")
    formData.append("image", file); 

    const { data } = await axiosInstance.patch(
      `/transaction-events/${transactionId}/upload-proof`,
      formData
    );
    
    return data;
  },

  // 4. CANCEL TRANSACTION: Membatalkan pesanan
  cancelTransaction: async (transactionId: number) => {
    // Sesuaikan endpoint ini dengan backend Anda (bisa patch status atau endpoint khusus)
    const { data } = await axiosInstance.patch(
      `/transaction-events/${transactionId}/cancel`
    );
    return data;
  },

  getTransactionDetail: async (transactionId: number) => {
    const { data } = await axiosInstance.get(
      `/transaction-events/${transactionId}`
    );
    return data;
  },
};