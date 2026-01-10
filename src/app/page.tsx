"use client";

import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/services/event.service";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useState } from "react";
import {
  Search,
  MapPin,
  CalendarDays,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { axiosInstance } from "@/lib/axios";

export default function HomePage() {
  // State untuk Filter & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState(""); // Filter Lokasi
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1); // Halaman saat ini

  // Fetch Data dengan parameter lengkap
  const { data: eventsResponse, isLoading } = useQuery({
    queryKey: ["events", searchQuery, selectedCategory, locationQuery, page],
    queryFn: () =>
      eventService.getEvents(
        searchQuery,
        selectedCategory,
        locationQuery,
        page
      ),
  });

  // Ambil data dari response backend yang baru
  const events = eventsResponse?.data || [];
  const totalPages = eventsResponse?.totalPages || 1;

  // Helper Functions
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll ke atas grid saat ganti halaman
      document
        .getElementById("event-grid")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-16">
        <section className="relative h-[450px] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

          <div className="relative z-10 text-center px-4 max-w-5xl w-full">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight drop-shadow-lg leading-tight">
              Jelajahi Event <span className="text-orange-500">Impianmu</span>
            </h1>

            {/* ADVANCED SEARCH BAR */}
            <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto">
              {/* Input Search Nama */}
              <div className="flex items-center flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-gray-200 py-2 md:py-0">
                <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari konser, workshop..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 h-10 placeholder:text-gray-400"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }} // Reset page ke 1 saat cari
                />
              </div>

              {/* Input Search Lokasi */}
              <div className="flex items-center w-full md:w-1/3 px-4 py-2 md:py-0">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Lokasi (e.g. Jakarta)"
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 h-10 placeholder:text-gray-400"
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <Button className="w-full md:w-auto rounded-xl px-8 py-6 h-auto bg-orange-600 hover:bg-orange-700 text-white font-bold text-md shadow-md">
                Cari
              </Button>
            </div>
          </div>
        </section>

        {/* Event Grid Section */}
        <section
          id="event-grid"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Event Terbaru
              </h2>
              <p className="text-gray-500 mt-1">
                Halaman {page} dari {totalPages}
              </p>
            </div>

            {/* Filter Kategori (Simple Chips) */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
              {["", "Music", "Sports", "Seminar", "Art"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-orange-500 hover:text-orange-500"
                  }`}
                >
                  {cat === "" ? "Semua" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-[450px]"
                >
                  <Skeleton className="h-52 w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))
            ) : events.length > 0 ? (
              events.map((event: any) => (
                <Link
                  href={`/events/${event.event_id}`}
                  key={event.event_id}
                  className="group block h-full"
                >
                  <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-52 overflow-hidden bg-gray-200">
                      <img
                        src={event.image || "/placeholder.jpg"}
                        alt={event.name_price}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-extrabold text-gray-900 shadow-sm uppercase">
                        {event.category || "General"}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <span
                        className={`text-xs font-semibold mb-2 inline-block ${Number(event.price) === 0 ? "text-green-600" : "text-orange-600"}`}
                      >
                        {Number(event.price) === 0 ? "Gratis" : "Berbayar"}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-orange-600 transition-colors leading-snug">
                        {event.name_price}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                        {event.description || "Deskripsi event belum tersedia."}
                      </p>
                      <div className="mt-auto space-y-2.5 text-sm text-gray-600">
                        <div className="flex items-center gap-2.5">
                          <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="truncate">
                            {formatDate(event.start_date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <User className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="truncate font-medium">
                            {event.organizer?.company_name || "Organizer"}
                          </span>
                        </div>
                      </div>
                      <div className="pt-5 mt-5 border-t border-gray-100 flex items-end justify-between">
                        <div>
                          {Number(event.price) === 0 ? (
                            <p className="text-gray-900 font-extrabold text-lg">
                              Gratis
                            </p>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                                Mulai dari
                              </span>
                              <p className="text-gray-900 font-extrabold text-lg leading-none">
                                {formatRupiah(Number(event.price))}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center text-sm font-bold text-orange-600">
                          Lihat Detail <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">
                  Tidak ada event yang ditemukan dengan filter ini.
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery("");
                    setLocationQuery("");
                    setSelectedCategory("");
                  }}
                  className="text-orange-600 font-bold mt-2"
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </div>

          {/* 👇 PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="border-gray-300 hover:border-orange-500 hover:text-orange-600"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Sebelumnya
              </Button>

              <div className="flex items-center px-4 font-semibold text-gray-700 bg-white border border-gray-200 rounded-md">
                Halaman {page} dari {totalPages}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="border-gray-300 hover:border-orange-500 hover:text-orange-600"
              >
                Selanjutnya <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </section>
        {/* CTA Section */}
        <section className="bg-slate-900 py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
              Punya Event Keren?
            </h2>
            <Link href="/create-event">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-10 py-6 text-lg rounded-full"
              >
                Mulai Buat Event
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
