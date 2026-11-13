"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";

interface ClientProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  account_number: string | null;
  balance: number;
}

export default function AdminLedgerForm({
  clients,
}: {
  clients: ClientProfile[];
}) {
  const supabase = createClient();
  const router = useRouter();

  const [selectedUserId, setSelectedUserId] = useState(clients[0]?.id || "");
  const [type, setType] = useState<"credit" | "debit">("credit");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handlePostTransaction(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const numericAmount = parseFloat(amount);
    if (!selectedUserId) {
      setError("Please select a client account.");
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount greater than $0.00.");
      return;
    }

    const targetClient = clients.find((c) => c.id === selectedUserId);
    if (!targetClient) {
      setError("Selected client account was not found.");
      return;
    }

    const currentBalance = Number(targetClient.balance);
    if (type === "debit" && numericAmount > currentBalance) {
      setError("Insufficient balance for this debit entry.");
      return;
    }

    const newBalance =
      type === "credit"
        ? currentBalance + numericAmount
        : currentBalance - numericAmount;

    setLoading(true);

    // 1. Insert the transaction record
    const { error: txError } = await supabase.from("transactions").insert({
      user_id: selectedUserId,
      title: title.trim(),
      type,
      amount: numericAmount,
      status: "Completed",
    });

    if (txError) {
      setLoading(false);
      setError(txError.message);
      return;
    }

    // 2. Update the client's balance
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ balance: newBalance })
      .eq("id", selectedUserId);

    setLoading(false);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    setTitle("");
    setAmount("");
    setSuccess(
      `${type === "credit" ? "Credited" : "Debited"} $${numericAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })} ${type === "credit" ? "to" : "from"} ${targetClient.full_name || targetClient.email}.`
    );

    router.refresh();
  }

  return (
    <form onSubmit={handlePostTransaction} className="space-y-5">
      <div>
        <label className="text-xs uppercase tracking-widest text-gray-400">
          Select Client Account
        </label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full mt-2 p-4 bg-[#080C12] border border-white/10 outline-none focus:border-[#C5A46D] text-sm text-white rounded-lg"
        >
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.full_name || "Private Client"} ({client.account_number}) — $
              {Number(client.balance).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-gray-400">
          Entry Type
        </label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <button
            type="button"
            onClick={() => setType("credit")}
            className={`p-3.5 border text-sm flex items-center justify-center gap-2 transition cursor-pointer rounded-lg ${
              type === "credit"
                ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-[#080C12] text-gray-400 hover:text-white"
            }`}
          >
            <ArrowDownLeft size={16} /> Credit (+)
          </button>

          <button
            type="button"
            onClick={() => setType("debit")}
            className={`p-3.5 border text-sm flex items-center justify-center gap-2 transition cursor-pointer rounded-lg ${
              type === "debit"
                ? "border-red-500/60 bg-red-500/10 text-red-400"
                : "border-white/10 bg-[#080C12] text-gray-400 hover:text-white"
            }`}
          >
            <ArrowUpRight size={16} /> Debit (-)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-gray-400">
            Transaction Description
          </label>
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Private Money Deposit"
            className="w-full mt-2 p-4 bg-[#080C12] border border-white/10 outline-none focus:border-[#C5A46D] text-sm rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-gray-400">
            Amount (USD)
          </label>
          <input
            required
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="25000.00"
            className="w-full mt-2 p-4 bg-[#080C12] border border-white/10 outline-none focus:border-[#C5A46D] text-sm rounded-lg"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl">
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      <button
        disabled={loading || clients.length === 0}
        className="w-full bg-[#C5A46D] text-[#080C12] py-4 font-semibold text-sm tracking-wide hover:bg-[#D9BC89] transition disabled:opacity-50 cursor-pointer rounded-lg motion-control"
      >
        {loading ? "Processing Ledger Entry..." : "Execute Ledger Entry"}
      </button>
    </form>
  );
}
