"use client";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  event_id: z
    .string()
    .nonempty("Event is required")
    .min(5, "Event must be at least 5 characters."),
  code_voucher: z
    .string()
    .nonempty("Event is required")
    .min(3, "Code must be at least 3 characters."),
  discount_percentage: z
    .string()
    .nonempty("Value is required")
    .min(1, "Description must be at least 1 characters."),
  max_discount_amount: z
    .string()
    .nonempty("Limit is required")
    .min(1, "Content must be at least 1 characters."),
});

export default function CreateVoucher() {
  const router = useRouter();
  const session = useSession();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_id: "",
      code_voucher: "",
      discount_percentage: "",
      max_discount_amount: "",
    },
  });

  function generateVoucherCode(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  }

  const { mutateAsync: write, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const formData = new FormData();

      formData.append("event_id", data.event_id);
      formData.append("code_voucher", data.code_voucher);
      formData.append("discount_percentage", data.discount_percentage);
      formData.append("max_discount_amount", data.max_discount_amount);

      await axiosInstance.post(`/vouchers/`, formData, {
        headers: { Authorization: `Bearer ${session.data?.user.accessToken}` },
      });
    },
    onSuccess: () => {
      toast.success("Create voucher success");
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
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
          <FieldLegend>Create Voucher</FieldLegend>

          <Controller
            name="event_id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="event_id">
                  Event <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="event_id"
                  aria-invalid={fieldState.invalid}
                  placeholder="event_id"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="code_voucher"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="code_voucher">
                  code_voucher <span className="text-red-500">*</span>
                </FieldLabel>

                <div className="flex gap-2">
                  <Input
                    {...field}
                    id="code_voucher"
                    readOnly
                    required
                    aria-required="true"
                    aria-invalid={fieldState.invalid}
                    placeholder="Auto generated"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      form.setValue("code_voucher", generateVoucherCode(), {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  >
                    Generate
                  </Button>
                </div>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="discount_percentage"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="discount_percentage">
                  discount_percentage <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="discount_percentage"
                  aria-invalid={fieldState.invalid}
                  placeholder="discount_percentage"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="max_discount_amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="max_discount_amount">
                  Limit <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="max_discount_amount"
                  aria-invalid={fieldState.invalid}
                  placeholder="max_discount_amount"
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
