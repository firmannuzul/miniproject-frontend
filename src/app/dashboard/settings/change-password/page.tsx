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

// export default function ChangePassword() {
//   return (
//     <div className="w-3xl">
//       <form>
//         <FieldGroup>
//           <FieldSet>
//             <FieldLegend>Change Password</FieldLegend>
//             <FieldDescription>Manage your passwords settings.</FieldDescription>
//             <FieldGroup>
//               <Field>
//                 <FieldLabel htmlFor="checkout-7j9-card-name-43j">
//                   Current Password
//                 </FieldLabel>
//                 <Input
//                   id="checkout-7j9-card-name-43j"
//                   placeholder="Current Password"
//                   required
//                 />
//               </Field>
//               <Field>
//                 <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
//                   New Password
//                 </FieldLabel>
//                 <Input
//                   id="checkout-7j9-card-number-uw1"
//                   placeholder="New Password"
//                   required
//                 />
//               </Field>
//               <Field>
//                 <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
//                   Confirm New Password
//                 </FieldLabel>
//                 <Input
//                   id="checkout-7j9-card-number-uw1"
//                   placeholder="Confirm New Password"
//                   required
//                 />
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
import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const ToggleButton = ({
    show,
    onClick,
  }: {
    show: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  const passwordMismatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword !== confirmPassword;

  const isDisabled =
    !currentPassword || !newPassword || !confirmPassword || passwordMismatch;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      return axiosInstance.patch("/users/me/password", {
        currentPassword,
        newPassword,
      });
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update password");
    },
  });

  return (
    // <div className="w-full max-w-xl">
    <div className="w-3xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutateAsync();
        }}
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Change Password</FieldLegend>
            <FieldDescription>
              Update your account password securely.
            </FieldDescription>

            <FieldGroup>
              {/* <Field>
                <FieldLabel>Current Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </Field> */}

              <Field>
                <FieldLabel>Current Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <ToggleButton
                    show={showCurrent}
                    onClick={() => setShowCurrent((v) => !v)}
                  />
                </div>
              </Field>

              {/* <Field>
                <FieldLabel>New Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Field> */}

              <Field>
                <FieldLabel>New Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <ToggleButton
                    show={showNew}
                    onClick={() => setShowNew((v) => !v)}
                  />
                </div>
              </Field>

              {/* <Field data-invalid={passwordMismatch}>
                <FieldLabel>Confirm New Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {passwordMismatch && (
                  <FieldError
                    errors={[
                      {
                        message: "Password confirmation does not match",
                      },
                    ]}
                  />
                )}
              </Field> */}

              <Field data-invalid={passwordMismatch}>
                <FieldLabel>Confirm New Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <ToggleButton
                    show={showConfirm}
                    onClick={() => setShowConfirm((v) => !v)}
                  />
                </div>

                {passwordMismatch && (
                  <FieldError
                    errors={[
                      { message: "Password confirmation does not match" },
                    ]}
                  />
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button type="submit" disabled={isDisabled || isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
