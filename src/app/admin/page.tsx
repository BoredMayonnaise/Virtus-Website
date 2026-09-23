"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { OperationsOS } from "@/components/dashboard/OperationsOS";

export default function AdminPortalPage() {
  const router = useRouter();

  return (
    <OperationsOS
      initialRole="admin"
      onExit={() => router.push("/portal")}
    />
  );
}
