// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Field,
//   FieldDescription,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { axiosInstance } from "@/lib/axios";
// import { cn } from "@/lib/utils";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import { AxiosError } from "axios";
// import { useRouter } from "next/navigation";
// import { Controller, useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";

// const formSchema = z.object({
//   name: z.string().min(5, "Name must be at least 5 characters."),
//   email: z.email(),
//   password: z.string().min(5, "Password must be at least 5 characters."),
// });

// export default function OrganizerSignupForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   const router = useRouter();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//     },
//   });

//   const { mutateAsync: register, isPending } = useMutation({
//     mutationFn: async (data: z.infer<typeof formSchema>) => {
//       //   const result = await axiosInstance.post("/auth/register", {
//       //     name: data.name,
//       //     email: data.email,
//       //     password: data.password,
//       //   });

//       const result = await axiosInstance.post("/auth/register", {
//         name: data.name,
//         email: data.email,
//         password: data.password,
//         role: "ORGANIZER",
//       });

//       return result.data;
//     },
//     onSuccess: () => {
//       toast.success("Register success");
//       router.push("/login");
//     },
//     onError: (error: AxiosError<{ message: string }>) => {
//       toast.error(error.response?.data.message ?? "Something went wrong!");
//     },
//   });

//   async function onSubmit(data: z.infer<typeof formSchema>) {
//     await register(data);
//   }

//   return (
//     <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
//       <div className="w-full max-w-sm md:max-w-4xl">
//         <div className={cn("flex flex-col gap-6", className)} {...props}>
//           <Card className="overflow-hidden p-0">
//             <CardContent className="grid p-0 md:grid-cols-2">
//               <form
//                 className="p-6 md:p-8"
//                 id="form-register"
//                 onSubmit={form.handleSubmit(onSubmit)}
//               >
//                 <FieldGroup>
//                   <div className="flex flex-col items-center gap-2 text-center">
//                     <h1 className="text-2xl font-bold">
//                       Register as event organizer
//                     </h1>
//                     <p className="text-muted-foreground text-sm text-balance">
//                       Fill in your details to sign up.
//                     </p>
//                   </div>

//                   <Controller
//                     name="name"
//                     control={form.control}
//                     render={({ field, fieldState }) => (
//                       <Field data-invalid={fieldState.invalid}>
//                         <FieldLabel htmlFor="name">Name</FieldLabel>
//                         <Input
//                           {...field}
//                           id="name"
//                           aria-invalid={fieldState.invalid}
//                           placeholder="Your name"
//                         />
//                         {fieldState.invalid && (
//                           <FieldError errors={[fieldState.error]} />
//                         )}
//                       </Field>
//                     )}
//                   />

//                   <Controller
//                     name="email"
//                     control={form.control}
//                     render={({ field, fieldState }) => (
//                       <Field data-invalid={fieldState.invalid}>
//                         <FieldLabel htmlFor="email">Email</FieldLabel>
//                         <Input
//                           {...field}
//                           id="email"
//                           type="email"
//                           aria-invalid={fieldState.invalid}
//                           placeholder="example@mail.com"
//                         />
//                         {fieldState.invalid && (
//                           <FieldError errors={[fieldState.error]} />
//                         )}
//                       </Field>
//                     )}
//                   />

//                   <Controller
//                     name="password"
//                     control={form.control}
//                     render={({ field, fieldState }) => (
//                       <Field data-invalid={fieldState.invalid}>
//                         <FieldLabel htmlFor="password">Password</FieldLabel>
//                         <Input
//                           {...field}
//                           id="password"
//                           type="password"
//                           aria-invalid={fieldState.invalid}
//                           placeholder="Your password"
//                         />
//                         {fieldState.invalid && (
//                           <FieldError errors={[fieldState.error]} />
//                         )}
//                       </Field>
//                     )}
//                   />

//                   <Field>
//                     <Button
//                       type="submit"
//                       form="form-register"
//                       disabled={isPending}
//                     >
//                       {isPending ? "Loading" : "Create Account"}
//                     </Button>
//                   </Field>

//                   <FieldDescription className="text-center">
//                     Already have an account? <a href="/login">Sign in</a>
//                   </FieldDescription>
//                 </FieldGroup>
//               </form>
//               <div className="bg-muted relative hidden md:block">
//                 <img
//                   src="/registerlogo.png"
//                   alt="Image"
//                   className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/* ==============================
   VALIDATION SCHEMA
================================ */
const formSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  email: z.email("Invalid email"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

type FormData = z.infer<typeof formSchema>;

/* ==============================
   PAGE COMPONENT
================================ */
export default function OrganizerSignupPage() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  /* ==============================
     MUTATION
  ================================ */
  const { mutateAsync: registerOrganizer, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      return axiosInstance.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "ORGANIZER", // 🔴 WAJIB
      });
    },
    onSuccess: () => {
      toast.success("Organizer registered successfully");
      router.push("/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Something went wrong");
    },
  });

  /* ==============================
     SUBMIT HANDLER (INI PENTING)
  ================================ */
  async function onSubmit(data: FormData) {
    await registerOrganizer(data);
  }

  /* ==============================
     RENDER
  ================================ */
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="text-center">
                <h1 className="text-2xl font-bold">
                  Register as Event Organizer
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create your organizer account
                </p>
              </div>

              {/* NAME */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Name</FieldLabel>
                    <Input {...field} placeholder="Your name" />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* EMAIL */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="example@mail.com"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* PASSWORD */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Your password"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* SUBMIT */}
              <Button type="submit" disabled={isPending}>
                {isPending ? "Loading..." : "Create Organizer Account"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
