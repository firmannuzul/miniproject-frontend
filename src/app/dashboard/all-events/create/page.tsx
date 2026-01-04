// "use client";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";

// import {
//   Field,
//   FieldDescription,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
//   FieldLegend,
//   FieldSet,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import * as React from "react";
// import { type DateRange } from "react-day-picker";
// import { Calendar } from "@/components/ui/calendar";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";

// import { IconCloud } from "@tabler/icons-react";
// import { MdDriveFolderUpload } from "react-icons/md";

// import {
//   Empty,
//   EmptyContent,
//   EmptyDescription,
//   EmptyHeader,
//   EmptyMedia,
//   EmptyTitle,
// } from "@/components/ui/empty";
// import z from "zod";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { axiosInstance } from "@/lib/axios";
// import { toast } from "sonner";
// import { AxiosError } from "axios";

// const formSchema = z.object({
//   title: z
//     .string()
//     .nonempty("Title is required")
//     .min(5, "Title must be at least 5 characters."),
//   description: z
//     .string()
//     .nonempty("Description is required")
//     .min(10, "Description must be at least 10 characters."),
//   thumbnail: z.instanceof(File),
// });

// export default function CreateEvent() {
//   const router = useRouter();
//   const session = useSession();
//   const queryClient = useQueryClient();

//   const today = new Date();

//   const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
//     from: today,
//     to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30),
//   });

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       thumbnail: undefined,
//     },
//   });

//   const { mutateAsync: write, isPending } = useMutation({
//     mutationFn: async (data: z.infer<typeof formSchema>) => {
//       const formData = new FormData();

//       formData.append("title", data.title);
//       formData.append("description", data.description);
//       formData.append("thumbnail", data.thumbnail);

//       await axiosInstance.post(`/blogs/`, formData, {
//         headers: { Authorization: `Bearer ${session.data?.user.accessToken}` },
//       });
//     },
//     onSuccess: () => {
//       toast.success("Create event success");
//       queryClient.invalidateQueries({ queryKey: ["blogs"] });
//       router.push("/");
//     },
//     onError: (error: AxiosError<{ message: string }>) => {
//       toast.error(error.response?.data.message ?? "Something went wrong!");
//     },
//   });

//   async function onSubmit(data: z.infer<typeof formSchema>) {
//     await write(data);
//   }

//   return (
//     <div className="w-5xl mt-6">
//       <form id="form-write" onSubmit={form.handleSubmit(onSubmit)}>
//         <FieldGroup>
//           <FieldLegend>Create Event</FieldLegend>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch min-h-[520px]">
//             <div className="md:col-span-2 h-full">
//               <Field className="h-full">
//                 <Controller
//                   name="title"
//                   control={form.control}
//                   render={({ field, fieldState }) => (
//                     <Field data-invalid={fieldState.invalid}>
//                       <FieldLabel htmlFor="title">
//                         Title <span className="text-red-500">*</span>
//                       </FieldLabel>
//                       <Input
//                         {...field}
//                         id="title"
//                         aria-invalid={fieldState.invalid}
//                         placeholder="Your title"
//                       />
//                       {fieldState.invalid && (
//                         <FieldError errors={[fieldState.error]} />
//                       )}
//                     </Field>
//                   )}
//                 />

//                 <FieldLabel htmlFor="checkout-7j9-card-name-43j">
//                   Category <span className="text-red-500">*</span>
//                 </FieldLabel>
//                 <Select>
//                   <SelectTrigger className="w-[200px]">
//                     <SelectValue placeholder="Select Category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="music">Music</SelectItem>
//                     <SelectItem value="art">Art</SelectItem>
//                     <SelectItem value="food">Food</SelectItem>
//                     <SelectItem value="business">Business</SelectItem>
//                     <SelectItem value="dating">Dating</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 <FieldLabel htmlFor="checkout-7j9-card-name-43j">
//                   Locations <span className="text-red-500">*</span>
//                 </FieldLabel>
//                 <Select>
//                   <SelectTrigger className="w-[200px]">
//                     <SelectValue placeholder="Select Category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="jakarta">Jakarta</SelectItem>
//                     <SelectItem value="bandung">Bandung</SelectItem>
//                     <SelectItem value="tangerang">Tangerang</SelectItem>
//                     <SelectItem value="surabaya">Surabaya</SelectItem>
//                     <SelectItem value="Yogyakarta">Yogyakarta</SelectItem>
//                     <SelectItem value="online">Online</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 <FieldLabel>
//                   Select Date Range <span className="text-red-500">*</span>
//                 </FieldLabel>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="w-[260px] justify-start text-left font-normal"
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {dateRange?.from ? (
//                         dateRange.to ? (
//                           <>
//                             {format(dateRange.from, "LLL dd, y")} -{" "}
//                             {format(dateRange.to, "LLL dd, y")}
//                           </>
//                         ) : (
//                           format(dateRange.from, "LLL dd, y")
//                         )
//                       ) : (
//                         <span>Select date range </span>
//                       )}
//                     </Button>
//                   </PopoverTrigger>

//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                       mode="range"
//                       defaultMonth={dateRange?.from}
//                       selected={dateRange}
//                       onSelect={setDateRange}
//                       numberOfMonths={2}
//                       className="rounded-lg border shadow-sm"
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </Field>
//             </div>

//             <div>
//               <Controller
//                 name="thumbnail"
//                 control={form.control}
//                 render={({ field, fieldState }) => (
//                   <Field data-invalid={fieldState.invalid}>
//                     <FieldLabel htmlFor="thumbnail">
//                       Thumbnail <span className="text-red-500">*</span>
//                     </FieldLabel>

//                     {/* Hidden input file */}
//                     <input
//                       id="thumbnail"
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={(e) => {
//                         const file = e.target.files?.[0];
//                         if (file) {
//                           field.onChange(file);
//                         }
//                       }}
//                     />

//                     {/* Empty UI */}
//                     <Empty className="border border-dashed h-full flex flex-col justify-center">
//                       <EmptyHeader>
//                         <EmptyMedia variant="icon">
//                           <MdDriveFolderUpload size={32} />
//                         </EmptyMedia>

//                         <EmptyTitle>
//                           {field.value ? "File selected" : "Upload files"}
//                         </EmptyTitle>

//                         <EmptyDescription>
//                           {field.value
//                             ? field.value.name
//                             : "No file uploaded yet."}
//                         </EmptyDescription>
//                       </EmptyHeader>

//                       <EmptyContent>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={() =>
//                             document.getElementById("thumbnail")?.click()
//                           }
//                         >
//                           Upload Files
//                         </Button>
//                       </EmptyContent>
//                     </Empty>

//                     {fieldState.invalid && (
//                       <FieldError errors={[fieldState.error]} />
//                     )}
//                   </Field>
//                 )}
//               />
//             </div>

//             {/* Description */}
//             <div className="md:col-span-3">
//               <Controller
//                 name="description"
//                 control={form.control}
//                 render={({ field, fieldState }) => (
//                   <Field data-invalid={fieldState.invalid}>
//                     <FieldLabel htmlFor="description">
//                       Description <span className="text-red-500">*</span>
//                     </FieldLabel>
//                     <Textarea
//                       {...field}
//                       id="description"
//                       aria-invalid={fieldState.invalid}
//                       placeholder="Your description"
//                     />
//                     {fieldState.invalid && (
//                       <FieldError errors={[fieldState.error]} />
//                     )}
//                   </Field>
//                 )}
//               />
//             </div>
//           </div>

//           <Field className="w-fit">
//             <Button type="submit" form="form-write" disabled={isPending}>
//               {isPending ? "Loading" : "Submit"}
//             </Button>
//           </Field>
//         </FieldGroup>
//       </form>
//     </div>
//   );
// }

// "use client";

// import * as React from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";

// import { useForm, Controller } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { AxiosError } from "axios";
// import { axiosInstance } from "@/lib/axios";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Field,
//   FieldGroup,
//   FieldLegend,
//   FieldError,
//   FieldLabel,
// } from "@/components/ui/field";

// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";

// import { Calendar } from "@/components/ui/calendar";
// import { CalendarIcon } from "lucide-react";
// import { format } from "date-fns";
// import type { DateRange } from "react-day-picker";

// import { MdDriveFolderUpload } from "react-icons/md";
// import {
//   Empty,
//   EmptyHeader,
//   EmptyMedia,
//   EmptyTitle,
//   EmptyDescription,
//   EmptyContent,
// } from "@/components/ui/empty";

// /* ======================
//    ZOD SCHEMA
// ====================== */
// const formSchema = z.object({
//   name_price: z.string().min(5, "Nama event minimal 5 karakter"),
//   description: z.string().min(10, "Deskripsi minimal 10 karakter"),
//   category: z.string().min(1, "Kategori wajib diisi"),
//   location: z.string().min(1, "Lokasi wajib diisi"),

//   price: z.coerce.number().min(0),
//   total_seats: z.coerce.number().min(1),

//   is_paid: z.boolean(),

//   start_date: z.date(),
//   end_date: z.date(),

//   image: z.instanceof(File, { message: "Gambar event wajib diupload" }),
// });

// /**
//  * 🔑 PENTING:
//  * - FormInput = input mentah (string, unknown, dll)
//  * - FormOutput = hasil akhir (number, Date, dll)
//  */
// type FormInput = z.input<typeof formSchema>;
// type FormOutput = z.output<typeof formSchema>;

// /* ======================
//    PAGE
// ====================== */
// export default function CreateEventPage() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const queryClient = useQueryClient();

//   const today = new Date();

//   const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
//     from: today,
//     to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
//   });

//   const form = useForm<FormInput>({
//     resolver: zodResolver(formSchema),
//     mode: "onChange",
//     defaultValues: {
//       name_price: "",
//       description: "",
//       category: "",
//       location: "",
//       price: 0,
//       total_seats: 1,
//       is_paid: true,
//     },
//   });

//   /* ======================
//      MUTATION
//   ====================== */
//   const { mutateAsync, isPending } = useMutation({
//     mutationFn: async (data: FormOutput) => {
//       const formData = new FormData();

//       formData.append("name_price", data.name_price);
//       formData.append("description", data.description);
//       formData.append("category", data.category);
//       formData.append("location", data.location);
//       formData.append("price", String(data.price));
//       formData.append("total_seats", String(data.total_seats));
//       formData.append("is_paid", String(data.is_paid));
//       formData.append("start_date", data.start_date.toISOString());
//       formData.append("end_date", data.end_date.toISOString());
//       formData.append("image", data.image);

//       await axiosInstance.post("/events", formData, {
//         headers: {
//           Authorization: `Bearer ${session?.user.accessToken}`,
//         },
//       });
//     },
//     onSuccess: () => {
//       toast.success("Event berhasil dibuat");
//       queryClient.invalidateQueries({ queryKey: ["events"] });
//       router.push("/dashboard/all-events");
//     },
//     onError: (error: AxiosError<{ message: string }>) => {
//       toast.error(error.response?.data?.message ?? "Terjadi kesalahan");
//     },
//   });

//   /* ======================
//      SUBMIT
//   ====================== */
//   // const onSubmit = async (data: FormInput) => {
//   //   if (!dateRange?.from || !dateRange?.to) {
//   //     toast.error("Pilih tanggal event");
//   //     return;
//   //   }

//   //   const payload: FormOutput = {
//   //     ...data,
//   //     start_date: dateRange.from,
//   //     end_date: dateRange.to,
//   //   };

//   //   await mutateAsync(payload);
//   // };
//   const onSubmit = async (data: FormInput) => {
//     if (!dateRange?.from || !dateRange?.to) {
//       toast.error("Pilih tanggal event");
//       return;
//     }

//     // 🔥 PARSE ULANG → INI YANG NGILANGIN ERROR
//     const parsed = formSchema.parse({
//       ...data,
//       start_date: dateRange.from,
//       end_date: dateRange.to,
//     });

//     await mutateAsync(parsed);
//   };

//   /* ======================
//      RENDER
//   ====================== */
//   return (
//     <div className="max-w-4xl">
//       <form onSubmit={form.handleSubmit(onSubmit)}>
//         <FieldGroup>
//           <FieldLegend>Create Event</FieldLegend>

//           {/* NAME */}
//           <Controller
//             name="name_price"
//             control={form.control}
//             render={({ field, fieldState }) => (
//               <Field>
//                 <FieldLabel>Event Name</FieldLabel>
//                 <Input {...field} />
//                 {fieldState.error && (
//                   <FieldError>{fieldState.error.message}</FieldError>
//                 )}
//               </Field>
//             )}
//           />

//           {/* CATEGORY */}
//           <Controller
//             name="category"
//             control={form.control}
//             render={({ field, fieldState }) => (
//               <Field>
//                 <FieldLabel>Category</FieldLabel>
//                 <Select value={field.value} onValueChange={field.onChange}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Pilih kategori" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="music">Music</SelectItem>
//                     <SelectItem value="art">Art</SelectItem>
//                     <SelectItem value="business">Business</SelectItem>
//                     <SelectItem value="food">Food</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 {fieldState.error && (
//                   <FieldError>{fieldState.error.message}</FieldError>
//                 )}
//               </Field>
//             )}
//           />

//           {/* LOCATION */}
//           <Controller
//             name="location"
//             control={form.control}
//             render={({ field, fieldState }) => (
//               <Field>
//                 <FieldLabel>Location</FieldLabel>
//                 <Input {...field} />
//                 {fieldState.error && (
//                   <FieldError>{fieldState.error.message}</FieldError>
//                 )}
//               </Field>
//             )}
//           />

//           {/* DATE */}
//           <Field>
//             <FieldLabel>Date Range</FieldLabel>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button variant="outline">
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {dateRange?.from && dateRange?.to
//                     ? `${format(dateRange.from, "LLL dd, y")} - ${format(
//                         dateRange.to,
//                         "LLL dd, y"
//                       )}`
//                     : "Pilih tanggal"}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent>
//                 <Calendar
//                   mode="range"
//                   selected={dateRange}
//                   onSelect={setDateRange}
//                   numberOfMonths={2}
//                   required
//                 />
//               </PopoverContent>
//             </Popover>
//           </Field>

//           {/* PRICE */}
//           {/* <Controller
//             name="price"
//             control={form.control}
//             render={({ field, fieldState }) => (
//               <Field>
//                 <FieldLabel>Price</FieldLabel>
//                 <Input
//                   type="number"
//                   value={field.value ?? ""}
//                   onChange={(e) =>
//                     field.onChange(e.target.valueAsNumber)
//                   }
//                 />
//                 {fieldState.error && (
//                   <FieldError>{fieldState.error.message}</FieldError>
//                 )}
//               </Field>
//             )}
//           /> */}
//           {/* <Controller
//             name="price"
//             control={form.control}
//             render={({ field, fieldState }) => (
//               <Field>
//                 <FieldLabel>Price</FieldLabel>
//                 <Input
//                   type="number"
//                   value={field.value ?? ""}
//                   onChange={(e) => field.onChange(e.target.valueAsNumber)}
//                 />
//                 {fieldState.error && (
//                   <FieldError>{fieldState.error.message}</FieldError>
//                 )}
//               </Field>
//             )}
//           /> */}

//           {/* SEATS */}
//           {/* <Controller
//             name="total_seats"
//             control={form.control}
//             render={({ field, fieldState }) => (
//               <Field>
//                 <FieldLabel>Total Seats</FieldLabel>
//                 <Input
//                   type="number"
//                   value={field.value ?? ""}
//                   onChange={(e) => field.onChange(e.target.valueAsNumber)}
//                 />
//                 {fieldState.error && (
//                   <FieldError>{fieldState.error.message}</FieldError>
//                 )}
//               </Field>
//             )}
//           /> */}

//           {/* IMAGE */}
//           <Controller
//             name="image"
//             control={form.control}
//             render={({ field, fieldState }) => (
//               <Field>
//                 <FieldLabel>Event Image</FieldLabel>
//                 <input
//                   type="file"
//                   hidden
//                   id="image-upload"
//                   accept="image/*"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     if (file) field.onChange(file);
//                   }}
//                 />
//                 <Empty
//                   className="border border-dashed cursor-pointer"
//                   onClick={() =>
//                     document.getElementById("image-upload")?.click()
//                   }
//                 >
//                   <EmptyHeader>
//                     <EmptyMedia variant="icon">
//                       <MdDriveFolderUpload size={32} />
//                     </EmptyMedia>
//                     <EmptyTitle>
//                       {field.value
//                         ? (field.value as File).name
//                         : "Upload Image"}
//                     </EmptyTitle>
//                     <EmptyDescription>JPG / PNG</EmptyDescription>
//                   </EmptyHeader>
//                   <EmptyContent>
//                     <Button type="button" variant="outline">
//                       Choose File
//                     </Button>
//                   </EmptyContent>
//                 </Empty>
//                 {fieldState.error && (
//                   <FieldError>{fieldState.error.message}</FieldError>
//                 )}
//               </Field>
//             )}
//           />

//           {/* DESCRIPTION */}
//           <Controller
//             name="description"
//             control={form.control}
//             render={({ field, fieldState }) => (
//               <Field>
//                 <FieldLabel>Description</FieldLabel>
//                 <Textarea {...field} rows={5} />
//                 {fieldState.error && (
//                   <FieldError>{fieldState.error.message}</FieldError>
//                 )}
//               </Field>
//             )}
//           />

//           <Button type="submit" disabled={isPending}>
//             {isPending ? "Creating..." : "Create Event"}
//           </Button>
//         </FieldGroup>
//       </form>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateEvent() {
  /* ======================
     STATE
  ====================== */
  const [namePrice, setNamePrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState<number>(1);
  const [totalSeats, setTotalSeats] = useState<number>(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState<File | null>(null);

  /* ======================
     VALIDATION
  ====================== */
  const hasError =
    !namePrice ||
    !description ||
    !category ||
    !location ||
    !startDate ||
    !endDate ||
    !image ||
    totalSeats < 1 ||
    price < 0;

  /* ======================
     MUTATION
  ====================== */
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name_price", namePrice);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("location", location);
      formData.append("price", String(price));
      formData.append("total_seats", String(totalSeats));
      formData.append("is_paid", String(price > 0));
      formData.append("start_date", new Date(startDate).toISOString());
      formData.append("end_date", new Date(endDate).toISOString());
      formData.append("image", image!);

      return axiosInstance.post("/events", formData);
    },
    onSuccess: () => {
      toast.success("Event created successfully");
      setNamePrice("");
      setDescription("");
      setCategory("");
      setLocation("");
      setPrice(0);
      setTotalSeats(1);
      setStartDate("");
      setEndDate("");
      setImage(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to create event");
    },
  });

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="w-3xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutateAsync();
        }}
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Create Event</FieldLegend>
            <FieldDescription>Create and publish your event</FieldDescription>

            <FieldGroup>
              {/* Event Name */}
              <Field>
                <FieldLabel>Event Name</FieldLabel>
                <Input
                  placeholder="Event name"
                  value={namePrice}
                  onChange={(e) => setNamePrice(e.target.value)}
                  required
                />
              </Field>

              {/* Category */}
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Input
                  placeholder="Music / Art / Business"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </Field>

              {/* Location */}
              <Field>
                <FieldLabel>Location</FieldLabel>
                <Input
                  placeholder="Jakarta / Online"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </Field>

              {/* Price */}
              <Field>
                <FieldLabel>Price</FieldLabel>
                {/* <Input
                  type="number"
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                /> */}
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Price"
                  value={price === 0 ? "" : price}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setPrice(value === "" ? 0 : Number(value));
                  }}
                />
              </Field>

              {/* Seats */}
              <Field>
                <FieldLabel>Total Seats</FieldLabel>
                {/* <Input
                  type="number"
                  min={1}
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(Number(e.target.value))}
                  required
                /> */}

                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Total Seats"
                  value={totalSeats === 0 ? "" : totalSeats}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setTotalSeats(value === "" ? 0 : Number(value));
                  }}
                />
              </Field>

              {/* Dates */}
              <Field>
                <FieldLabel>Start Date</FieldLabel>
                <Input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>End Date</FieldLabel>
                <Input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </Field>

              {/* Image */}
              <Field data-invalid={!image}>
                <FieldLabel>Event Image</FieldLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                  required
                />
                {!image && (
                  <FieldError errors={[{ message: "Image is required" }]} />
                )}
              </Field>

              {/* Description */}
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  placeholder="Describe your event"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button type="submit" disabled={hasError || isPending}>
            {isPending ? "Creating..." : "Create Event"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
