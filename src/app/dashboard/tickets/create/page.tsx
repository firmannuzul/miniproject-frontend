"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
import z from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

const formSchema = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .min(5, "Title must be at least 5 characters."),
  price: z
    .string()
    .nonempty("Price is required")
    .min(3, "Category must be at least 3 characters."),
  description: z
    .string()
    .nonempty("Description is required")
    .min(10, "Description must be at least 10 characters."),
  limit: z.string().min(10, "Content must be at least 10 characters."),
});

export default function CreateTicket() {
  const router = useRouter();
  const session = useSession();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      limit: "",
    },
  });

  const { mutateAsync: write, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("limit", data.limit);

      await axiosInstance.post(`/blogs/`, formData, {
        headers: { Authorization: `Bearer ${session.data?.user.accessToken}` },
      });
    },
    onSuccess: () => {
      toast.success("Create blog success");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      router.push("/");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Something went wrong!");
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await write(data);
  }
  return (
    <div className="w-3xl mt-6">
      <form id="form-write" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldLegend>Create Ticket</FieldLegend>

          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Title"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="price">
                  Price <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="price"
                  aria-invalid={fieldState.invalid}
                  placeholder="Price"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="limit"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="limit">
                  Limit <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="limit"
                  aria-invalid={fieldState.invalid}
                  placeholder="Limit"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
              Event <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="checkout-7j9-card-number-uw1"
              placeholder="1234 5678 9012 3456"
              required
            />
          </Field>

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  aria-invalid={fieldState.invalid}
                  placeholder="Your description"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field className="w-fit">
            <Button type="submit" form="form-write" disabled={isPending}>
              {isPending ? "Loading" : "Submit"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
