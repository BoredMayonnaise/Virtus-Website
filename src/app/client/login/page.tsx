import { AuthShell } from "@/components/client/AuthShell";
import { ClientLoginForm } from "@/components/client/ClientLoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Client Login · The Virtus Labs",
  description: "Log in to your Virtus Labs client dashboard.",
  robots: { index: false, follow: false },
};

export default async function ClientLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string | string[] }>;
}) {
  const params = await searchParams;
  const reason = Array.isArray(params.reason) ? params.reason[0] : params.reason;

  return (
    <AuthShell footerLabel="The Virtus Labs · Client login">
      <ClientLoginForm linkFailed={reason === "link"} />
    </AuthShell>
  );
}
