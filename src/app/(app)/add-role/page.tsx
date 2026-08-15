import { AddRoleView } from "@/modules/onboarding/ui/views/add-role-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Peran - NEXORA",
  description: "Tambahkan peran baru ke akun NEXORA Anda.",
};

export default function AddRolePage() {
  return <AddRoleView />;
}
