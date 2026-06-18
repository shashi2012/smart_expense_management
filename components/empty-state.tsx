"use client";

import { motion } from "framer-motion";
import { WalletCards } from "lucide-react";

export function EmptyState({ title = "No expenses added yet.", description = "Start tracking your spending today." }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center light:border-slate-200 light:bg-slate-50"
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl" />
        <div className="relative rounded-full border border-white/10 bg-white/10 p-5 light:border-slate-200 light:bg-white">
          <WalletCards className="h-10 w-10 text-emerald-300 light:text-emerald-600" />
        </div>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
