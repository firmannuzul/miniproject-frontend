"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

// Services & Lib
import { eventService } from "@/services/event.service";
import { reviewService } from "@/services/review.service";
import { userService } from "@/services/user.service";
import { axiosInstance } from "@/lib/axios";

// UI Components
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  MapPin,
  Info,
  User,
  Coins,
  Loader2,
  Minus,
  Plus,
  Star,
  MessageSquare,
  Ticket,
  Tag,
} from "lucide-react";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.id);

  // Auth & Session
  const { data: session, status } = useSession();
  const isUserLoggedIn = status === "authenticated";

  // State
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [voucherCode, setVoucherCode] = useState("");
  const [usePoints, setUsePoints] = useState(false);

  // Review State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Fetch Data
  const { data: eventData, isLoading: isEventLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventService.getEventDetail(eventId),
    enabled: !!eventId,
  });
  const event = eventData?.data;

  const { data: organizerData, isLoading: isOrgLoading } = useQuery({
    queryKey: ["organizer-info", event?.organizer_id],
    queryFn: () => eventService.getOrganizerById(event.organizer_id),
    enabled: !!event?.organizer_id,
  });
  const organizer = organizerData?.data || organizerData;

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", eventId],
    queryFn: () => reviewService.getReviewsByEvent(eventId),
    enabled: !!eventId,
  });
  const reviews = reviewsData?.data || [];

  const { data: userData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => userService.getProfile(),
    enabled: isUserLoggedIn,
  });
  const userPoints = userData?.data?.point_balance || 0;

  // Calculations
  const ticketPrice = Number(selectedTicket?.price) || 0;
  const isFree = ticketPrice === 0;
  const subTotal = ticketPrice * qty;
  const pointsToRedeem = Math.min(userPoints, subTotal);
  const estimatedTotal = isFree ? 0 : subTotal - (usePoints ? pointsToRedeem : 0);

  useEffect(() => {
    if (isFree) {
      setVoucherCode("");
      setUsePoints(false);
    }
  }, [isFree]);

  // Mutations
  // Mutations
  const createTransactionMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTicket) throw new Error("Pilih tiket terlebih dahulu");

      const payload = {
        event_id: eventId,
        items: [
          {
            tiket_id: selectedTicket.tiket_id || selectedTicket.id,
            quantity: qty,
          },
        ],
        // PERBAIKAN: Kirim null/0 jika gratis agar backend tidak mencoba memvalidasi voucher/poin
        voucher_code: isFree ? null : (voucherCode || null),
        point_used: isFree ? 0 : (usePoints ? pointsToRedeem : 0),
      };

      // Pastikan nominal 0 diterima oleh endpoint ini
      const { data } = await axiosInstance.post("/transaction-events", payload);
      return data;
    },
    onSuccess: (data) => {
      // PERBAIKAN: Jika pendaftaran gratis, biasanya tidak ada snap_token/redirect pembayaran
      toast.success(isFree ? "Pendaftaran Gratis Berhasil!" : "Pesanan Berhasil Dibuat!");
      
      // Berikan jeda sebentar agar user bisa membaca toast
      setTimeout(() => {
        // Jika gratis, mungkin lebih baik arahkan ke halaman 'Tiket Saya'
        // router.push(`/profile/tickets`); 
        router.push(`/transaction-events`);
      }, 1500);
    },
    onError: (err: any) => {
      // PERBAIKAN: Tracing error lebih detail
      const errorMessage = err.response?.data?.message || "Gagal transaksi";
      toast.error(errorMessage);
      console.error("Detail Error Transaksi:", err.response?.data);
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: (payload: {
      event_id: number;
      rating: number;
      comment: string;
    }) => reviewService.createReview(payload),
    onSuccess: () => {
      toast.success("Ulasan berhasil dikirim!");
      setComment("");
      setRating(5);
      refetchReviews();
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.message || "Gagal kirim ulasan"),
  });

  useEffect(() => {
    if (event?.ticketTypes?.length > 0 && !selectedTicket) {
      setSelectedTicket(event.ticketTypes[0]);
    }
  }, [event]);

  const formatRupiah = (p: number) => {
    if (p === 0) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(p);
  };

  if (status === "loading" || isEventLoading) return <DetailSkeleton />;
  if (!event)
    return (
      <div className="text-center py-32 font-bold text-2xl text-gray-500">
        Event tidak ditemukan.
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800">
        <img
          src={event.image || "/placeholder.jpg"}
          className="w-full h-full object-cover opacity-30"
          alt={event.name_price}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            {event.name_price}
          </h1>
          <div className="flex flex-wrap gap-6 text-sm opacity-90 justify-center">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              <span>
                {new Date(event.start_date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Description */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-slate-900">
              <Info className="w-7 h-7 text-blue-600" />
              Deskripsi
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-8">
              {event.description}
            </p>

            {/* Organizer Info */}
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">
                  Diselenggarakan Oleh
                </p>
                <Link
                  href={`/organizer/${event?.organizer_id}`}
                  className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-lg"
                >
                  {organizer?.name || organizer?.user?.name || "Organizer"}
                </Link>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-slate-900">
              <Star className="w-7 h-7 text-yellow-500" />
              Berikan Ulasan
            </h2>
            {isUserLoggedIn ? (
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      onClick={() => setRating(s)}
                      className={`w-8 h-8 cursor-pointer transition-colors ${
                        s <= rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                    />
                  ))}
                </div>
                <Textarea
                  placeholder="Bagikan pengalaman Anda..."
                  className="mb-4 bg-white border-gray-200 h-32 rounded-lg"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  onClick={() =>
                    createReviewMutation.mutate({
                      event_id: eventId,
                      rating,
                      comment,
                    })
                  }
                  disabled={createReviewMutation.isPending || !comment}
                  className="bg-blue-600 hover:bg-blue-700 font-semibold px-8 py-3 h-auto rounded-lg shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  {createReviewMutation.isPending ? (
                    <Loader2 className="animate-spin mr-2 w-5 h-5" />
                  ) : (
                    "Kirim Ulasan"
                  )}
                </Button>
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 italic">
                <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Login untuk memberikan ulasan.</p>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-slate-900">
              <MessageSquare className="w-7 h-7 text-blue-600" />
              Ulasan Pembeli ({reviews.length})
            </h2>
            <div className="space-y-6">
              {reviews.map((r: any) => (
                <div
                  key={r.review_id}
                  className="p-6 rounded-xl bg-gray-50 border border-gray-200 flex gap-4 hover:shadow-sm transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-slate-900">{r.user?.name}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(r.review_date).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < r.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 italic">"{r.comment}"</p>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">Belum ada ulasan.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 sticky top-24">
            <div className="mb-8 border-b border-gray-200 pb-6">
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wide mb-2">
                Mulai Dari
              </p>
              <h2 className="text-4xl font-black text-slate-900">
                {formatRupiah(ticketPrice)}
              </h2>
            </div>

            {/* Ticket Selection */}
            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                Pilih Tiket
              </h3>
              {event.ticketTypes?.map((t: any) => (
                <div
                  key={t.tiket_id}
                  onClick={() => {
                    setSelectedTicket(t);
                    setQty(1);
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all hover:shadow-sm ${
                    selectedTicket?.tiket_id === t.tiket_id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <span className="font-semibold text-slate-900">{t.name}</span>
                  <span className="font-bold text-slate-900">
                    {formatRupiah(Number(t.price))}
                  </span>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex justify-between items-center border border-gray-200">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                Jumlah
              </span>
              <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="hover:bg-gray-100 rounded p-1 transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-500" />
                </button>
                <span className="font-bold text-blue-600 min-w-[2rem] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="hover:bg-gray-100 rounded p-1 transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Voucher Input */}
            <div
              className={`mb-6 transition-all ${
                isFree ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder={isFree ? "VOUCHER DINONAKTIFKAN" : "KODE VOUCHER"}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 font-semibold uppercase rounded-lg"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  disabled={isFree}
                />
              </div>
            </div>

            {/* Points */}
            <div
              className={`mb-8 transition-all ${
                isFree ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div
                onClick={() => !isFree && setUsePoints(!usePoints)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  usePoints && !isFree
                    ? "bg-blue-500 border-blue-500 text-white shadow-lg"
                    : "bg-white border-gray-200 hover:border-blue-300"
                } ${!isFree ? "cursor-pointer" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <Coins
                    className={`w-5 h-5 ${
                      usePoints && !isFree ? "text-white" : "text-blue-500"
                    }`}
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase leading-none mb-1">
                      Poin Loyalitas
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        usePoints && !isFree
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {isFree
                        ? "Tidak tersedia"
                        : `Saldo: ${userPoints.toLocaleString()}`}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    usePoints && !isFree
                      ? "bg-white border-white"
                      : "border-gray-300"
                  }`}
                >
                  {usePoints && !isFree && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-sm font-semibold text-gray-500 uppercase tracking-wide">
                <span>Subtotal</span>
                <span className="text-slate-900 font-bold">
                  {formatRupiah(subTotal)}
                </span>
              </div>
              {usePoints && !isFree && (
                <div className="flex justify-between text-sm font-semibold text-green-600 uppercase tracking-wide">
                  <span>Potongan Poin</span>
                  <span className="font-bold">- {formatRupiah(pointsToRedeem)}</span>
                </div>
              )}
              <div className="flex justify-between items-end pb-6 pt-4 border-t border-gray-200 mt-4">
                <span className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                  Total Bayar
                </span>
                <span className="text-3xl font-black text-blue-600">
                  {formatRupiah(estimatedTotal)}
                </span>
              </div>

              <Button
                onClick={() => createTransactionMutation.mutate()}
                disabled={createTransactionMutation.isPending}
                className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                {createTransactionMutation.isPending ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : isFree ? (
                  "Daftar Gratis"
                ) : (
                  "Beli Tiket Sekarang"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function DetailSkeleton() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      <div className="h-[400px] bg-gray-200 animate-pulse" />
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
        <Skeleton className="h-[600px] rounded-2xl" />
      </div>
      <Footer />
    </main>
  );
}