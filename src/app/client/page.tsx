"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { OperationsOS } from "@/components/dashboard/OperationsOS";

export default function ClientPortalPage() {
  const router = useRouter();

  return (
    <OperationsOS
      initialRole="client"
      onExit={() => router.push("/portal")}
    />
  );
}
