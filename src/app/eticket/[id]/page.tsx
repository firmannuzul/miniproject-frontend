"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { transactionEventService } from "@/services/transaction-event.service";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  MapPin, 
  Ticket, 
  Download, 
  ArrowLeft, 
  Copy, 
  CheckCircle2, 
  Share2 
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";

export default function ETicketPage() {
  const params = useParams();
  const router = useRouter();
  const [trx, setTrx] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await transactionEventService.getTransactionDetail(Number(params.id));
        const data = response.data || response;
        setTrx(data);
      } catch (error) {
        toast.error("Gagal memuat tiket");
        router.push("/transactions-event");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [params.id, router]);

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("ID Transaksi disalin!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-orange-500 rounded-full mb-4 animate-bounce"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!trx) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center print:bg-white print:p-0">
      
      {/* Header Nav (Mobile Friendly) */}
      <div className="w-full max-w-lg flex justify-between items-center mb-8 print:hidden">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.back()} 
          className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Button>
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">E-Ticket</div>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-orange-600 hover:bg-orange-50">
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* --- TICKET CARD (Matching Friend's Theme) --- */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-100 print:shadow-none print:border-black">
        
        {/* 1. Header Image & Status */}
        <div className="relative h-64 bg-gray-200">
          <img 
            src={trx.event.image || "/placeholder.jpg"} 
            alt="Event Banner" 
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          {/* Status Badge (Green for Success) */}
          <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
            <CheckCircle2 className="w-3 h-3 mr-1.5" />
            LUNAS
          </div>

          {/* Event Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-2 inline-block shadow-sm">
              {trx.event.category || "EVENT"}
            </span>
            <h1 className="text-2xl font-bold leading-tight mb-1">
              {trx.event.name_price}
            </h1>
            <p className="text-white/80 text-sm font-medium">Order #{trx.transaction_id}</p>
          </div>
        </div>

        {/* 2. Main Info Section */}
        <div className="p-6 bg-white">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> Tanggal
              </p>
              <p className="text-sm font-bold text-gray-900">
                 {new Date(trx.event.start_date).toLocaleDateString("id-ID", {
                    weekday: "short", day: "numeric", month: "short", year: "numeric"
                 })}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(trx.event.start_date).toLocaleTimeString("id-ID", {hour: '2-digit', minute:'2-digit'})} WIB
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Lokasi
              </p>
              <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                {trx.event.location}
              </p>
            </div>
          </div>

          {/* Ticket List with "Orange" Accent */}
          <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <Ticket className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold text-orange-900 uppercase">Detail Tiket</span>
            </div>
            <div className="space-y-2">
               {trx.transactionItems.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-dashed border-orange-200/50 last:border-0 pb-2 last:pb-0">
                    <span className="text-gray-700 font-medium">{item.ticketType.name}</span>
                    <span className="font-bold text-gray-900">x{item.quantity}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* --- TEAR-OFF (Perforated Edge) --- */}
        <div className="relative flex items-center justify-between bg-white">
          <div className="absolute left-0 -ml-3 w-6 h-6 bg-gray-50 rounded-full border-r border-gray-100" />
          <div className="w-full border-t-2 border-dashed border-gray-200 mx-6" />
          <div className="absolute right-0 -mr-3 w-6 h-6 bg-gray-50 rounded-full border-l border-gray-100" />
        </div>

        {/* 3. QR Code Section */}
        <div className="bg-white p-8 flex flex-col items-center text-center">
          <div className="bg-white p-2 rounded-xl border-2 border-gray-900 shadow-sm mb-4">
             <QRCode
                size={160}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={`TRX-${trx.transaction_id}-USER-${trx.user_id}`}
                viewBox={`0 0 256 256`}
            />
          </div>
          
          <div 
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-orange-300 transition-all group"
            onClick={() => copyToClipboard(`TRX-${trx.transaction_id}`)}
          >
            <p className="text-xs font-mono font-bold text-gray-600 group-hover:text-orange-600">
              ID: TRX-{trx.transaction_id}
            </p>
            <Copy className="w-3 h-3 text-gray-400 group-hover:text-orange-500" />
          </div>

          <p className="text-[10px] text-gray-400 mt-4">
            Scan QR Code ini di pintu masuk acara.
          </p>
        </div>

        {/* 4. Footer Button */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 print:hidden">
            <Button 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md shadow-orange-200" 
              onClick={handlePrint}
            >
              <Download className="w-4 h-4 mr-2" /> Simpan E-Ticket (PDF)
            </Button>
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mt-6 print:hidden">
        &copy; 2024 Eventbrite
      </p>
    </main>
  );
}