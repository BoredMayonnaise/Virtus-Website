"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { OperationsOS } from "@/components/dashboard/OperationsOS";

export default function TeamPortalPage() {
  const router = useRouter();

  return (
    <OperationsOS
      initialRole="team"
      onExit={() => router.push("/portal")}
    />
  );
}
