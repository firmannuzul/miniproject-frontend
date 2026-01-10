"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query"; 
import { eventOrganizerService } from "@/services/event-organizer.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Tag, ImageIcon, Loader2 } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

interface EventFormValues {
  name: string;
  description: string;
  location: string;
  category: string;
  start_date: string;
  end_date: string;
  total_seats: number;
  image: File | null;
  ticketTypes: { name: string; price: number; quantity: number }[];
}

export default function CreateEventPage() {
  const router = useRouter();

  const { register, control, handleSubmit, setValue, watch } = useForm<EventFormValues>({
    defaultValues: {
      name: "",
      description: "",
      location: "",
      category: "",
      start_date: "",
      end_date: "",
      total_seats: 0,
      image: null,
      ticketTypes: [{ name: "Reguler", price: 0, quantity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "ticketTypes" });

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormValues) => {
      const formData = new FormData();
      
      // Append data basic
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("location", data.location);
      formData.append("category", data.category);
      formData.append("start_date", data.start_date);
      formData.append("end_date", data.end_date);
      formData.append("total_seats", data.total_seats.toString());
      
      // Append Image (File Object)
      if (data.image) {
        formData.append("image", data.image);
      }

      // Append ticketTypes as JSON string
      formData.append("ticketTypes", JSON.stringify(data.ticketTypes));

      return await eventOrganizerService.createEvent(formData);
    },
    onSuccess: () => {
      toast.success("Event berhasil dipublikasikan!");
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal membuat event");
    },
  });

  const onSubmit = (data: EventFormValues) => {
    if (!data.image) return toast.error("Poster event wajib diunggah!");
    createEventMutation.mutate(data);
  };

  const currentImage = watch("image");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <h1 className="text-2xl font-bold">Buat Event Baru</h1>

            <div className="space-y-4">
              <Input {...register("name", { required: true })} placeholder="Nama Event" />
              
              <div className="grid grid-cols-2 gap-4">
                <Input {...register("category", { required: true })} placeholder="Kategori" />
                <Input {...register("location", { required: true })} placeholder="Lokasi" />
              </div>

              <Textarea {...register("description", { required: true })} placeholder="Deskripsi Event" rows={4} />

              <div className="grid grid-cols-3 gap-4">
                <Input type="datetime-local" {...register("start_date")} />
                <Input type="datetime-local" {...register("end_date")} />
                <Input type="number" {...register("total_seats", { valueAsNumber: true })} placeholder="Total Seat" />
              </div>

              {/* UPLOAD POSTER (Mirip dengan cara upload proof) */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Poster Event</label>
                <div className="border-2 border-dashed rounded-xl p-8 text-center relative bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setValue("image", file);
                    }}
                  />
                  <ImageIcon className="mx-auto text-gray-400 w-12 h-12 mb-2" />
                  <p className="text-sm text-gray-500">Klik untuk upload poster</p>
                  {currentImage && (
                    <p className="mt-2 text-xs text-green-600 font-bold">✓ {currentImage.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* TICKET SECTION */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2"><Tag className="w-4 h-4" /> Kategori Tiket</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", price: 0, quantity: 0 })}>
                  Tambah Tiket
                </Button>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end bg-gray-50 p-4 rounded-lg border">
                  <Input {...register(`ticketTypes.${index}.name` as const)} placeholder="Nama (VIP/Reguler)" />
                  <Input type="number" {...register(`ticketTypes.${index}.price` as const, { valueAsNumber: true })} placeholder="Harga" />
                  <Input type="number" {...register(`ticketTypes.${index}.quantity` as const, { valueAsNumber: true })} placeholder="Qty" />
                  <Button type="button" variant="ghost" className="text-red-500" onClick={() => remove(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700 h-12 font-bold" 
              disabled={createEventMutation.isPending}
            >
              {createEventMutation.isPending ? <Loader2 className="animate-spin" /> : "Publikasikan Event"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}