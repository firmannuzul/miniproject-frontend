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
