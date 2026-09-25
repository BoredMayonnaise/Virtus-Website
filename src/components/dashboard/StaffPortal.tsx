"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { OperationsOS, type StaffIdentity } from "./OperationsOS";

/** Client wrapper for the staff workspace: owns logout so the server pages stay simple. */
export function StaffPortal({ staff, initialRole }: { staff: StaffIdentity; initialRole: "admin" | "team" }) {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/staff/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/staff/login");
    router.refresh();
  };

  return <OperationsOS staff={staff} initialRole={initialRole} onLogout={logout} />;
}
