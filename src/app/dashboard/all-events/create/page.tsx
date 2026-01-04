"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
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
