import {
  ArrowUpRight,
  ArrowDownLeft,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ClientSidebar from "@/components/ClientSidebar";
import AnimatedCurrency from "@/components/AnimatedCurrency";
import UserAvatar from "@/components/UserAvatar";

export const instant = false;

interface Transaction {
  id: string;
  title: string;
  type: "credit" | "debit";
  amount: number;
  status: string;
  created_at: string;
}

export default async function DashboardPage() {
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

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const txList: Transaction[] = transactions || [];

  const fullName =
    profile?.full_name || user.user_metadata?.full_name || "Private Client";
  const accountNumber = profile?.account_number || "Pending Assignment";
  const balance = Number(profile?.balance ?? 0);

  const totalIncome = txList
    .filter((tx) => tx.type === "credit")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpenses = txList
    .filter((tx) => tx.type === "debit")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <main className="min-h-screen bg-[#080C12] text-white">
      <ClientSidebar isAdmin={profile?.role === "admin"} />

      <section className="p-6 md:p-12 lg:ml-64">
        <header className="flex justify-between items-center mb-14 motion-enter">
          <div>
            <p className="text-gray-500 text-sm">Welcome back,</p>
            <h2 className="text-3xl font-serif mt-2">{fullName}</h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/transfers"
              className="hidden sm:inline-flex items-center gap-2 border border-[#C5A46D]/40 px-4 py-2.5 text-xs tracking-wider uppercase text-[#D6B77A] hover:bg-[#C5A46D] hover:text-[#080C12] transition rounded-lg motion-control"
            >
              <ArrowUpRight size={15} /> Send Money
            </Link>
            <Bell className="text-gray-400 cursor-pointer hover:text-white transition" />
            <Link href="/dashboard/settings" title="Account Settings">
              <UserAvatar
                fullName={fullName}
                avatarUrl={profile?.avatar_url || null}
              />
            </Link>
          </div>
        </header>

        {/* Primary Balance Card */}
        <div className="border border-[#C5A46D]/30 bg-linear-to-br from-[#20252D] to-[#101720] p-8 md:p-12 rounded-2xl motion-card motion-enter motion-enter-delay-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-gray-400 text-sm">
              AVAILABLE  BALANCE
            </p>
            <p className="text-xs tracking-[0.2em] text-[#D6B77A] font-mono">
              ACCOUNT: {accountNumber}
            </p>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-[#D6B77A] mt-5">
            <AnimatedCurrency amount={balance} />
          </h1>

          <p className="text-gray-500 text-xs mt-4">
            Current available account balance
          </p>
        </div>

        {/* Summary Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mt-8 motion-enter motion-enter-delay-2">
          {[
            { title: "Total Assets", amount: balance },
            { title: "Income", amount: totalIncome },
            { title: "Expenses", amount: totalExpenses },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#101720] border border-white/10 p-7 rounded-xl motion-card"
            >
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h3 className="text-2xl font-serif text-white mt-4">
                <AnimatedCurrency amount={item.amount} />
              </h3>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="mt-10 bg-[#101720] border border-white/10 p-8 rounded-2xl motion-card motion-enter motion-enter-delay-3">
          <h3 className="text-xl font-serif mb-8">Recent Transactions</h3>

          {txList.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No transactions available yet.
            </p>
          ) : (
            <div className="divide-y divide-white/10">
              {txList.map((tx) => (
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
                        {new Date(tx.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        • {tx.status}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`font-serif text-base ${
                      tx.type === "credit" ? "text-emerald-400" : "text-gray-200"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}
                    {formatCurrency(Number(tx.amount))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
