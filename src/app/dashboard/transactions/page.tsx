import { ArrowDownLeft, ArrowUpRight, ReceiptText } from "lucide-react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ClientSidebar from "@/components/ClientSidebar";

export const instant = false;

interface Transaction {
  id: string;
  title: string;
  type: "credit" | "debit";
  amount: number;
  status: string;
  created_at: string;
}

export default async function TransactionsPage() {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: transactions, error: transactionsError }] =
    await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).single(),
      supabase
        .from("transactions")
        .select("id, title, type, amount, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  const txList: Transaction[] = transactions || [];
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <main className="min-h-screen bg-[#080C12] text-white">
      <ClientSidebar isAdmin={profile?.role === "admin"} />

      <section className="p-6 md:p-12 lg:ml-64">
        <header className="mb-10 motion-enter">
          <p className="text-gray-500 text-sm">Account activity</p>
          <h2 className="mt-2 text-3xl font-serif">Transaction History</h2>
        </header>

        <div className="mb-6 border border-[#C5A46D]/20 bg-[#101720] px-5 py-4 text-xs text-gray-400 rounded-xl motion-enter motion-enter-delay-1">
          Verified transaction history. Completed entries reflect settled fund transfers.
        </div>

        <div className="border border-white/10 bg-[#101720] p-6 md:p-8 rounded-2xl motion-card motion-enter motion-enter-delay-2">
          <div className="mb-6 flex items-center gap-3">
            <ReceiptText size={20} className="text-[#D6B77A]" />
            <h3 className="text-xl font-serif">All Transactions</h3>
          </div>

          {transactionsError ? (
            <p role="alert" className="text-sm text-red-400">
              Transaction history could not be loaded. Please try again later.
            </p>
          ) : txList.length === 0 ? (
            <p className="text-sm text-gray-500">No transactions available yet.</p>
          ) : (
            <div className="divide-y divide-white/10">
              {txList.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between gap-4 py-5"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-[#080C12] text-[#D6B77A] rounded-xl">
                      {tx.type === "credit" ? (
                        <ArrowDownLeft size={18} />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {tx.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(tx.created_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                        {" · "}
                        <span className="capitalize">{tx.status}</span>
                      </p>
                    </div>
                  </div>

                  <p
                    className={`shrink-0 font-serif text-base ${
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
