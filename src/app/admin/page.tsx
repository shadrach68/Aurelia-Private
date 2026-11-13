import {
  Users,
  Wallet,
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import AdminLedgerForm from "@/components/AdminLedgerForm";
import AdminConciergePanel from "@/components/AdminConciergePanel";
import ClientSidebar from "@/components/ClientSidebar";

export const instant = false;

export default async function AdminPage() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (currentProfile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: allProfiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: recentTransactions } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(15);

  const { data: allMessages } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  const clients = allProfiles || [];
  const transactions = recentTransactions || [];
  const messages = allMessages || [];

  const clientMap = new Map(
    clients.map((c) => [c.id, { name: c.full_name, account: c.account_number }])
  );

  const totalAssetsUnderManagement = clients.reduce(
    (sum, client) => sum + Number(client.balance || 0),
    0
  );

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  return (
    <main className="min-h-screen bg-[#080C12] text-white">
      <ClientSidebar isAdmin adminView />

      {/* Main Admin Workspace */}
      <section className="p-6 md:p-12 lg:ml-64">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 motion-enter">
          <div>
            <p className="text-[#C5A46D] text-xs tracking-[0.3em] uppercase">
              Administrative Operations
            </p>
            <h2 className="text-3xl font-serif mt-2">
              Private Client Ledger
            </h2>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-white/15 px-4 py-2.5 text-xs tracking-wider uppercase text-gray-300 hover:border-[#C5A46D] hover:text-[#D6B77A] transition rounded-lg motion-control"
          >
            <ArrowLeft size={15} /> Switch to Client View
          </Link>
        </header>

        {/* System Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#101720] border border-[#C5A46D]/30 p-7 rounded-xl motion-card motion-enter motion-enter-delay-1">
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <span>Assets Under Management</span>
              <Wallet size={18} className="text-[#D6B77A]" />
            </div>
            <h3 className="text-3xl font-serif text-[#D6B77A] mt-4">
              {formatCurrency(totalAssetsUnderManagement)}
            </h3>
          </div>

          <div className="bg-[#101720] border border-white/10 p-7 rounded-xl motion-card motion-enter motion-enter-delay-2">
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <span>Registered Client Accounts</span>
              <Users size={18} className="text-[#D6B77A]" />
            </div>
            <h3 className="text-3xl font-serif text-white mt-4">
              {clients.length}
            </h3>
          </div>
        </div>

        {/* Ledger Action Form & Client Directory */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-[#101720] border border-white/10 p-8 rounded-2xl motion-card motion-enter motion-enter-delay-1">
            <h3 className="text-xl font-serif mb-2">Post Account Adjustment</h3>
            <p className="text-gray-400 text-xs mb-6">
              Credit or debit any client account. Updates reflect immediately on
              the client dashboard.
            </p>
            <AdminLedgerForm clients={clients} />
          </div>

          <div className="bg-[#101720] border border-white/10 p-8 rounded-2xl motion-card motion-enter motion-enter-delay-2">
            <h3 className="text-xl font-serif mb-6">Client Accounts</h3>
            <div className="divide-y divide-white/10">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">
                        {client.full_name || "Private Client"}
                      </p>
                      {client.role === "admin" && (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#C5A46D]/20 text-[#D6B77A] rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {client.email} •{" "}
                      <span className="font-mono text-gray-400">
                        {client.account_number}
                      </span>
                    </p>
                  </div>

                  <p className="font-serif text-base text-[#D6B77A]">
                    {formatCurrency(Number(client.balance))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Concierge Inbox */}
        <div className="mt-8 bg-[#101720] border border-white/10 p-8 rounded-2xl motion-card motion-enter">
          <h3 className="text-xl font-serif mb-2">Client Concierge Desk</h3>
          <p className="text-gray-400 text-xs mb-6">
            Review client support requests and send direct responses.
          </p>
          <AdminConciergePanel clients={clients} allMessages={messages} />
        </div>

        {/* Global Activity Log */}
        <div className="mt-8 bg-[#101720] border border-white/10 p-8 rounded-2xl motion-card motion-enter motion-enter-delay-1">
          <h3 className="text-xl font-serif mb-6">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No ledger entries posted yet.
            </p>
          ) : (
            <div className="divide-y divide-white/10">
              {transactions.map((tx) => {
                const owner = clientMap.get(tx.user_id);
                return (
                  <div
                    key={tx.id}
                    className="py-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#080C12] border border-white/10 flex items-center justify-center text-[#D6B77A] rounded-xl">
                        {tx.type === "credit" ? (
                          <ArrowDownLeft size={18} />
                        ) : (
                          <ArrowUpRight size={18} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {tx.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {owner?.name || "Client"} ({owner?.account}) •{" "}
                          {new Date(tx.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`font-serif text-base ${
                        tx.type === "credit"
                          ? "text-emerald-400"
                          : "text-gray-200"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}
                      {formatCurrency(Number(tx.amount))}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
