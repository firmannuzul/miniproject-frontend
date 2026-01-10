"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { transactionEventService } from "@/services/transaction-event.service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Ticket,
  Clock,
  AlertCircle,
  UploadCloud,
  XCircle,
  CheckCircle2,
  ChevronRight,
  Search,
  Hourglass,
  ImageIcon,
  Loader2,
} from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function TransactionEventPage() {
  const [selectedTrxId, setSelectedTrxId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // 1. Fetch Transactions
  const { data: apiResponse, refetch, isLoading } = useQuery({
    queryKey: ["transactions-event"],
    queryFn: transactionEventService.getMyHistory,
  });

  const transactions = apiResponse?.data || [];

  // 2. Mutation Upload
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTrxId || !file) throw new Error("File atau ID tidak valid");
      return await transactionEventService.uploadProof(selectedTrxId, file);
    },
    onSuccess: () => {
      toast.success("Bukti pembayaran berhasil diunggah!");
      setIsUploadOpen(false);
      setFile(null);
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Gagal mengunggah bukti.");
    },
  });

  // 3. Mutation Cancel
  const cancelMutation = useMutation({
    mutationFn: (id: number) => transactionEventService.cancelTransaction(id),
    onSuccess: () => {
      toast.success("Transaksi berhasil dibatalkan");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Gagal membatalkan transaksi.");
    },
  });

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case "PENDING":
        return { color: "bg-orange-50 text-orange-700 border-orange-200", label: "Menunggu Pembayaran", icon: Clock };
      case "ACCEPTED":
        return { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "E-Ticket Terbit", icon: CheckCircle2 };
      case "REJECTED":
        return { color: "bg-red-50 text-red-700 border-red-200", label: "Dibatalkan / Ditolak", icon: XCircle };
      default:
        return { color: "bg-gray-50 text-gray-700 border-gray-200", label: status, icon: AlertCircle };
    }
  };

  // FIX: Loading state agar tidak crash saat data belum ada
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Memuat tiket...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tiket Saya</h1>
              <p className="text-sm text-gray-500 mt-1">Riwayat pembelian tiket event Anda.</p>
            </div>
          </div>

          {/* FIX: Cek array transactions, bukan objek event tunggal */}
          {transactions.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300 shadow-sm mt-4">
              <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Belum ada tiket</h3>
              <p className="text-gray-500 mt-2 text-sm max-w-sm mx-auto mb-6">Anda belum memiliki riwayat pembelian tiket.</p>
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link href="/events">Jelajahi Event</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {transactions.map((trx: any) => {
                const statusStyle = getStatusBadge(trx.status);
                const StatusIcon = statusStyle.icon;
                const totalTickets = trx.transactionItems?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
                
                return (
                  <div key={trx.transaction_id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gray-100 shrink-0 overflow-hidden">
                        {/* FIX: Gunakan optional chaining (?.) untuk mencegah error undefined */}
                        {trx.event?.image ? (
                          <img 
                            src={trx.event.image} 
                            alt={trx.event.name_price} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageIcon className="w-10 h-10" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusStyle.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusStyle.label}
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono">#{trx.transaction_id}</span>
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600">
                            {trx.event?.name_price || "Event Tidak Tersedia"}
                          </h3>

                          <div className="mt-3 space-y-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarDays className="w-4 h-4 mr-2.5 text-gray-400" />
                              {trx.event?.start_date ? new Date(trx.event.start_date).toLocaleDateString("id-ID", {
                                weekday: "long", day: "numeric", month: "short", year: "numeric"
                              }) : "-"}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2.5 text-gray-400" />
                              <span className="line-clamp-1">{trx.event?.location || "-"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Ticket className="w-4 h-4 text-orange-500" />
                            {totalTickets} Tiket
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400 mb-0.5">Total Bayar</p>
                            <p className="text-lg font-bold text-orange-600">{formatRupiah(trx.final_amount)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Aksi Sidebar */}
                      <div className="p-4 sm:w-56 bg-gray-50/50 border-t sm:border-t-0 sm:border-l border-gray-100 flex flex-col justify-center gap-3">
                        {trx.status?.toUpperCase() === "PENDING" && (
                          <>
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={() => { setSelectedTrxId(trx.transaction_id); setIsUploadOpen(true); }}>
                              <UploadCloud className="w-4 h-4 mr-2" /> Upload Bukti
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => confirm("Batal transaksi?") && cancelMutation.mutate(trx.transaction_id)}>
                              Batalkan
                            </Button>
                          </>
                        )}
                        {trx.status?.toUpperCase() === "ACCEPTED" && (
                          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            <Link href={`/eticket/${trx.transaction_id}`}><Ticket className="w-4 h-4 mr-2" /> Lihat E-Ticket</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modal Upload */}
      <Dialog open={isUploadOpen} onOpenChange={(open) => { setIsUploadOpen(open); if(!open) setFile(null); }}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Upload Bukti Pembayaran</DialogTitle>
            <DialogDescription>Pastikan nominal transfer sesuai dengan total tagihan.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Batal</Button>
            <Button onClick={() => uploadMutation.mutate()} disabled={!file || uploadMutation.isPending} className="bg-orange-600 hover:bg-orange-700">
              {uploadMutation.isPending ? "Mengirim..." : "Kirim Bukti"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}