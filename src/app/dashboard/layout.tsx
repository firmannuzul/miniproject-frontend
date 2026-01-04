import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // ❌ BELUM LOGIN → STOP TOTAL
  if (!session) {
    redirect("/login");
  }

  // ✅ SUDAH LOGIN
  return <DashboardShell>{children}</DashboardShell>;
}
