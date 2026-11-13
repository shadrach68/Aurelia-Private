"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  AlertCircle,
  Loader2,
  ShieldAlert,
  X,
} from "lucide-react";

export default function TransferForm({
  availableBalance,
  senderAccountNumber,
}: {
  availableBalance: number;
  senderAccountNumber: string;
}) {
  const [recipientAccount, setRecipientAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState("");
  const [modalState, setModalState] = useState<"closed" | "processing" | "error">("closed");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError("Please enter a valid transfer amount greater than $0.00.");
      return;
    }

    if (numericAmount > availableBalance) {
      setFormError("Transfer amount exceeds your available balance.");
      return;
    }

    setModalState("processing");

    timerRef.current = setTimeout(() => {
      setModalState("error");
    }, 3000);
  }

  function closeModal() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setModalState("closed");
  }

  const formattedAmount = !isNaN(parseFloat(amount))
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(parseFloat(amount))
    : "$0.00";

  return (
    <>
      <form onSubmit={handleTransfer} className="space-y-6">
        <div className="bg-[#080C12] border border-white/10 p-4 flex items-center justify-between text-xs rounded-xl">
          <span className="text-gray-400">ORIGINATING ACCOUNT</span>
          <span className="font-mono text-[#D6B77A]">{senderAccountNumber}</span>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-gray-400">
            Recipient Account Number
          </label>
          <input
            required
            type="text"
            value={recipientAccount}
            onChange={(e) => setRecipientAccount(e.target.value)}
            placeholder="AUR-12345678"
            className="w-full mt-2 p-4 bg-[#080C12] border border-white/10 outline-none focus:border-[#C5A46D] text-sm font-mono uppercase rounded-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
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
              placeholder="10000.00"
              className="w-full mt-2 p-4 bg-[#080C12] border border-white/10 outline-none focus:border-[#C5A46D] text-sm rounded-lg"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-gray-400">
              Reference Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Advisory Retainer"
              className="w-full mt-2 p-4 bg-[#080C12] border border-white/10 outline-none focus:border-[#C5A46D] text-sm rounded-lg"
            />
          </div>
        </div>

        {formError && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
            <AlertCircle size={17} />
            <span>{formError}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#C5A46D] text-[#080C12] py-4 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#D9BC89] transition cursor-pointer rounded-lg motion-control"
        >
          Authorize Transfer
          <ArrowUpRight size={18} />
        </button>
      </form>

      {/* Transfer Status Modal */}
      {modalState !== "closed" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 motion-overlay">
          <div key={modalState} className="bg-[#101720] border border-[#C5A46D]/40 max-w-md w-full p-8 text-center relative shadow-2xl rounded-2xl motion-enter">
            {modalState === "processing" && (
              <div className="py-4">
                <Loader2
                  size={44}
                  className="text-[#D6B77A] animate-spin mx-auto mb-5"
                />
                <h3 className="text-xl font-serif text-white">
                  Processing Transfer
                </h3>
                <p className="text-gray-400 text-sm mt-3">
                  Authorizing transfer of{" "}
                  <span className="text-[#D6B77A] font-medium">
                    {formattedAmount}
                  </span>{" "}
                  to{" "}
                  <span className="font-mono text-gray-200">
                    {recipientAccount.trim().toUpperCase()}
                  </span>
                  ...
                </p>
              </div>
            )}

            {modalState === "error" && (
              <div className="py-2">
                <button
                  onClick={closeModal}
                  aria-label="Close modal"
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition cursor-pointer"
                >
                  <X size={20} />
                </button>

                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
                  <ShieldAlert size={28} className="text-red-400" />
                </div>

                <h3 className="text-xl font-serif text-white">
                  Transfer Unable to Complete
                </h3>

                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                  Something went wrong while processing this transaction. Please
                  contact customer service for assistance.
                </p>

                <div className="mt-7 space-y-3">
                  <Link
                    href="/dashboard/concierge"
                    className="block w-full bg-[#C5A46D] text-[#080C12] py-3.5 font-semibold text-sm hover:bg-[#D9BC89] transition rounded-lg motion-control"
                  >
                    Contact Customer Service
                  </Link>

                  <button
                    onClick={closeModal}
                    className="w-full border border-white/15 text-gray-300 py-3 text-xs uppercase tracking-wider hover:text-white transition cursor-pointer rounded-lg motion-control"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
