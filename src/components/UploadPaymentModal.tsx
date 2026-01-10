"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { transactionEventService } from "@/services/transaction-event.service";
import { toast } from "sonner";
import { Upload, Loader2, CreditCard } from "lucide-react";

interface Props {
  transactionId: number;
  onSuccess: () => void;
}

export default function UploadPaymentModal({ transactionId, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return toast.error("Pilih file bukti transfer dulu!");

    setLoading(true);
    try {
      await transactionEventService.uploadProof(transactionId, file);
      toast.success("Bukti pembayaran berhasil dikirim!");
      setOpen(false); // Tutup modal setelah sukses
      onSuccess();    // Refresh data halaman utama
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal upload bukti bayar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Tombol Pemicu Modal */}
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
          <CreditCard className="mr-2 h-4 w-4" /> Upload Bukti Bayar
        </Button>
      </DialogTrigger>
      
      {/* Isi Modal (Popup) */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Bukti Pembayaran</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
            <p className="font-semibold mb-1">Instruksi Pembayaran:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Transfer sesuai total tagihan.</li>
              <li>Simpan bukti transfer (foto/screenshot).</li>
              <li>Upload bukti tersebut di bawah ini.</li>
            </ul>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proof">File Gambar (JPG/PNG)</Label>
            <Input 
              id="proof" 
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
          <Button onClick={handleUpload} disabled={loading || !file}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Mengirim..." : "Kirim Sekarang"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}