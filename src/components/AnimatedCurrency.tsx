"use client";

import { useEffect, useState } from "react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function AnimatedCurrency({ amount }: { amount: number }) {
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    const finalAmount = amount;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const duration = 900;
    let frameId = 0;
    let startTime: number | undefined;

    if (reduceMotion || !Number.isFinite(finalAmount)) {
      frameId = window.requestAnimationFrame(() => {
        setDisplayAmount(finalAmount);
      });

      return () => window.cancelAnimationFrame(frameId);
    }

    function animate(timestamp: number) {
      if (startTime === undefined) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setDisplayAmount(finalAmount * easedProgress);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    }

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, [amount]);

  return (
    <span aria-label={currencyFormatter.format(amount)} aria-live="off">
      {currencyFormatter.format(displayAmount)}
    </span>
  );
}
