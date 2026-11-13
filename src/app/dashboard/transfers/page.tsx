import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ClientSidebar from "@/components/ClientSidebar";
import TransferForm from "@/components/TransferForm";

export const instant = false;

export default async function TransfersPage() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const balance = Number(profile?.balance ?? 0);
  const accountNumber = profile?.account_number || "Pending Assignment";

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  return (
    <main className="min-h-screen bg-[#080C12] text-white">
      <ClientSidebar isAdmin={profile?.role === "admin"} />

      <section className="p-6 md:p-12 lg:ml-64">
        <header className="mb-12 motion-enter">
          <p className="text-gray-500 text-sm">Private Client Treasury</p>
          <h2 className="text-3xl font-serif mt-2">Wire Transfers</h2>
        </header>

        <div className="max-w-2xl">
          <div className="border border-[#C5A46D]/30 bg-linear-to-br from-[#20252D] to-[#101720] p-7 mb-8 rounded-2xl motion-card motion-enter motion-enter-delay-1">
            <p className="text-gray-400 text-xs tracking-widest">
              AVAILABLE FOR IMMEDIATE TRANSFER
            </p>
            <h3 className="text-3xl font-serif text-[#D6B77A] mt-3">
              {formatCurrency(balance)}
            </h3>
          </div>

          <div className="bg-[#101720] border border-white/10 p-8 rounded-2xl motion-card motion-enter motion-enter-delay-2">
            <h3 className="text-xl font-serif mb-2">
              Initiate Transfer
            </h3>
            <p className="text-gray-400 text-xs mb-8">
              Transfer funds instantaneously to any registered Aurelia
              client account number.
            </p>

            <TransferForm
              availableBalance={balance}
              senderAccountNumber={accountNumber}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
