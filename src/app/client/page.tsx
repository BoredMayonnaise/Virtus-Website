import { redirect } from "next/navigation";
import { ClientDashboard } from "@/components/client/ClientDashboard";
import { getClientSessionId } from "@/lib/clientSession";
import { getClientPortalData } from "@/lib/clientPortal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Client Dashboard · The Virtus Labs",
  description: "Your project workspace at The Virtus Labs.",
  robots: { index: false, follow: false },
};

export default async function ClientPage() {
  // Middleware already gates this route; this re-check also covers revoked or expired keys.
  const clientId = await getClientSessionId();
  if (!clientId) redirect("/client/login");

  const data = await getClientPortalData(clientId);
  if (!data) redirect("/client/login");

  return <ClientDashboard initialData={data} />;
}
