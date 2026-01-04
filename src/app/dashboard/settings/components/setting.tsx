// "use client";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
//   FieldLegend,
//   FieldSeparator,
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
// import { Textarea } from "@/components/ui/textarea";

// export function Setting() {
//   return (
//     <div className="w-3xl">
//       <form>
//         <FieldGroup>
//           <FieldSet>
//             <FieldLegend>Profile</FieldLegend>
//             <FieldDescription>Manage your profile settings</FieldDescription>
//             <FieldGroup>
//               <Field>
//                 <FieldLabel htmlFor="checkout-7j9-card-name-43j">
//                   Full Name
//                 </FieldLabel>
//                 <Input
//                   id="checkout-7j9-card-name-43j"
//                   placeholder="Evil Rabbit"
//                   required
//                 />
//                 <FieldDescription>
//                   You can edit your full name here.
//                 </FieldDescription>
//               </Field>
//               <Field>
//                 <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
//                   Email
//                 </FieldLabel>
//                 <Input
//                   id="checkout-7j9-card-number-uw1"
//                   placeholder="1234 5678 9012 3456"
//                   required
//                 />
//                 <FieldDescription>This field is not editable.</FieldDescription>
//               </Field>
//               <Field>
//                 <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
//                   Role
//                 </FieldLabel>
//                 <Input
//                   id="checkout-7j9-card-number-uw1"
//                   placeholder="1234 5678 9012 3456"
//                   required
//                 />
//                 <FieldDescription>This field is not editable.</FieldDescription>
//               </Field>
//             </FieldGroup>
//           </FieldSet>
//           {/* <FieldSeparator /> */}

//           <Field orientation="horizontal">
//             <Button type="submit">Save</Button>
//           </Field>
//         </FieldGroup>
//       </form>
//     </div>
//   );
// }

// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
//   FieldLegend,
//   FieldSet,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { axiosInstance } from "@/lib/axios";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// export function Setting() {
//   const {
//     data: me,
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["me"],
//     queryFn: async () => {
//       const res = await axiosInstance.get("/users/me");
//       return res.data;
//     },
//   });

//   const [name, setName] = useState("");
//   const [avatar, setAvatar] = useState<File | null>(null);

//   const { mutateAsync: updateProfile, isPending } = useMutation({
//     mutationFn: async () => {
//       const formData = new FormData();
//       formData.append("name", name || me.name);

//       if (avatar) {
//         formData.append("profile_picture", avatar);
//       }

//       return axiosInstance.patch("/users/me", formData);
//     },
//     onSuccess: () => {
//       toast.success("Profile updated");
//       setAvatar(null);
//       refetch();
//     },
//   });

//   if (isLoading) return <p>Loading...</p>;
//   if (!me) return null;
//   // <div className="mx-auto w-full max-w-2xl space-y-6">

//   return (
//     // <div className="max-w-xl space-y-6">
//     <div className="mx-auto w-full max-w-2xl space-y-6">
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           updateProfile();
//         }}
//       >
//         <FieldGroup>
//           <FieldSet>
//             <FieldLegend>Profile</FieldLegend>
//             <FieldDescription>Manage your profile settings</FieldDescription>

//             <FieldGroup>
//               {/* AVATAR */}
//               <Field>
//                 <FieldLabel>Profile Picture</FieldLabel>

//                 <div className="flex items-center gap-4">
//                   <img
//                     src={
//                       avatar
//                         ? URL.createObjectURL(avatar)
//                         : (me.profile_picture_url ?? "/avatar-placeholder.png")
//                     }
//                     alt="avatar"
//                     className="h-20 w-20 rounded-full object-cover border"
//                   />

//                   <Input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
//                   />
//                 </div>

//                 <FieldDescription>
//                   Upload a new profile picture
//                 </FieldDescription>
//               </Field>

//               {/* FULL NAME */}
//               <Field>
//                 <FieldLabel>Full Name</FieldLabel>
//                 <Input
//                   value={name || me.name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </Field>

//               {/* EMAIL */}
//               <Field>
//                 <FieldLabel>Email</FieldLabel>
//                 <Input value={me.email} disabled />
//               </Field>

//               {/* ROLE */}
//               <Field>
//                 <FieldLabel>Role</FieldLabel>
//                 <Input value={me.role} disabled />
//               </Field>
//             </FieldGroup>
//           </FieldSet>

//           <Button type="submit" disabled={isPending}>
//             {isPending ? "Saving..." : "Save"}
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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Setting() {
  const {
    data: me,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/me");
      return res.data;
    },
  });

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (me) setName(me.name);
  }, [me]);

  useEffect(() => {
    if (!avatar) return setPreview(null);
    const url = URL.createObjectURL(avatar);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatar]);

  const isChanged = me && (name !== me.name || avatar !== null);

  const { mutateAsync: updateProfile, isPending } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", name);
      if (avatar) formData.append("profile_picture", avatar);
      return axiosInstance.patch("/users/me", formData);
    },
    onSuccess: () => {
      toast.success("Profile updated");
      setAvatar(null);
      refetch();
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (!me) return null;

  //   return (
  //     <div className="w-full px-6 py-6">
  //       <div className="max-w-xl mx-auto">
  //         <form
  //           onSubmit={(e) => {
  //             e.preventDefault();
  //             updateProfile();
  //           }}
  //           className="space-y-6"
  //         >
  //           <FieldGroup>
  //             <FieldSet>
  //               <FieldLegend>Profile</FieldLegend>
  //               <FieldDescription>Manage your profile settings</FieldDescription>

  //               <FieldGroup>
  //                 <Field>
  //                   <FieldLabel>Profile Picture</FieldLabel>
  //                   <div className="flex items-center gap-4">
  //                     <img
  //                       src={
  //                         preview ??
  //                         me.profile_picture_url ??
  //                         "/avatar-placeholder.png"
  //                       }
  //                       className="h-20 w-20 rounded-full object-cover border"
  //                     />
  //                     <Input
  //                       type="file"
  //                       accept="image/*"
  //                       onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
  //                     />
  //                   </div>
  //                 </Field>

  //                 <Field>
  //                   <FieldLabel>Full Name</FieldLabel>
  //                   <Input
  //                     value={name}
  //                     onChange={(e) => setName(e.target.value)}
  //                   />
  //                 </Field>

  //                 <Field>
  //                   <FieldLabel>Email</FieldLabel>
  //                   <Input value={me.email} disabled />
  //                 </Field>

  //                 <Field>
  //                   <FieldLabel>Role</FieldLabel>
  //                   <Input value={me.role} disabled />
  //                 </Field>
  //               </FieldGroup>
  //             </FieldSet>

  //             <Button type="submit" disabled={!isChanged || isPending}>
  //               {isPending ? "Saving..." : "Save"}
  //             </Button>
  //           </FieldGroup>
  //         </form>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="w-3xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateProfile();
        }}
        className="space-y-6"
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Profile</FieldLegend>
            <FieldDescription>Manage your profile settings</FieldDescription>

            <FieldGroup>
              <Field>
                <FieldLabel>Profile Picture</FieldLabel>
                <div className="flex items-center gap-4">
                  <img
                    src={
                      preview ??
                      me.profile_picture_url ??
                      "/avatar-placeholder.png"
                    }
                    className="h-20 w-20 rounded-full object-cover border"
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input value={me.email} disabled />
              </Field>

              <Field>
                <FieldLabel>Role</FieldLabel>
                <Input value={me.role} disabled />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button type="submit" disabled={!isChanged || isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
