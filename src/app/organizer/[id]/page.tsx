"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/services/event.service";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Ticket,
  MapPin,
  Calendar,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function OrganizerProfilePage() {
  const params = useParams();
  const organizerId = Number(params.id);

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["organizer-profile", organizerId],
    queryFn: () => eventService.getOrganizerById(organizerId),
    enabled: !!organizerId,
  });

  const organizer = apiResponse?.data;
  const events = organizer?.events || [];
  
  const allReviews = events.flatMap((ev: any) => ev.reviews || []);
  const averageRating = allReviews.length > 0 
    ? (allReviews.reduce((acc: number, item: any) => acc + item.rating, 0) / allReviews.length).toFixed(1)
    : "5.0";

  if (isLoading) return <ProfileSkeleton />;
  if (!organizer) return <div className="text-center py-48 font-bold text-2xl">Organizer tidak ditemukan.</div>;

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* --- JUMBOTRON HERO SECTION --- */}
      {/* min-h-[50vh] memberikan ruang bernapas yang sangat luas di bawah navbar */}
      <section className="relative w-full min-h-[55vh] flex flex-col items-center justify-center bg-white pt-24">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col items-center text-center">
          
          {/* NAMA PENYELENGGARA (Fokus Utama & Tidak Terhalang) */}
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">
            {organizer.company_name || "aceks"}
          </h1>

          {/* DESKRIPSI */}
          <p className="text-gray-500 text-lg md:text-xl max-w-3xl leading-relaxed mb-12">
            {organizer.description || "Penyelenggara event resmi yang berfokus pada pengalaman terbaik bagi seluruh komunitas."}
          </p>

          {/* STATISTIK DATA (Horizontal & Lega) */}
          <div className="flex flex-row items-center justify-center gap-10 md:gap-16 mb-12 border-y border-gray-100 py-8 w-full max-w-4xl">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-orange-600 font-black text-2xl">
                <Ticket className="w-6 h-6" />
                <span>{events.length}</span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Event Terbit</span>
            </div>
            
            <div className="flex flex-col items-center border-x border-gray-100 px-10 md:px-16">
              <div className="flex items-center gap-2 text-orange-600 font-black text-2xl">
                <Star className="w-6 h-6 fill-current" />
                <span>{averageRating}</span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Rating</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-orange-600 font-black text-2xl">
                <MapPin className="w-6 h-6" />
                <span>ID</span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Lokasi</span>
            </div>
          </div>

          {/* TOMBOL AKSI */}
          <div className="flex gap-4">
            <Button variant="outline" className="px-12 h-14 rounded-xl font-bold text-lg border-gray-200 shadow-sm transition-all active:scale-95">
              Follow
            </Button>
            <Button variant="outline" className="px-12 h-14 rounded-xl font-bold text-lg border-gray-200 shadow-sm transition-all active:scale-95">
              Contact
            </Button>
          </div>
        </div>
      </section>

      {/* --- CONTENT SECTION: EVENTS (Simetris & Rapi) --- */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          
          <div className="mb-16 flex items-center gap-4">
             <div className="bg-orange-600 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
             </div>
             <h2 className="text-4xl font-black text-slate-900">Event Mendatang</h2>
          </div>

          {/* GRID EVENT: Simetris & Jarak Aman */}
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {events.map((ev: any) => (
                <Link href={`/events/${ev.event_id}`} key={ev.event_id} className="group flex flex-col h-full">
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                    <img 
                      src={ev.image || "/placeholder.jpg"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={ev.name_price}
                    />
                  </div>
                  
                  <div className="pt-6 flex flex-col flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 line-clamp-2 leading-tight mb-4 min-h-[4rem]">
                      {ev.name_price}
                    </h3>
                    
                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex flex-col">
                         <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Mulai Dari</span>
                         <span className="text-xl font-black text-slate-900">
                           {Number(ev.price) === 0 ? "Free" : `Rp ${Number(ev.price).toLocaleString('id-ID')}`}
                         </span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 font-bold text-sm">
                        Detail <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 border-4 border-dashed border-gray-50 rounded-[3rem]">
               <p className="text-gray-300 font-black text-3xl italic">Belum ada event mendatang.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen pt-40 px-6 max-w-7xl mx-auto space-y-20">
      <Skeleton className="h-48 w-full rounded-3xl" />
      <div className="grid grid-cols-3 gap-12">
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
      </div>
    </div>
  );
}