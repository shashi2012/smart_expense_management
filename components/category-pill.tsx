"use client";

import {
  BookOpen,
  Clapperboard,
  GraduationCap,
  HeartPulse,
  Plane,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

export const categoryMeta: Record<Category, { icon: LucideIcon; color: string; gradient: string }> = {
  Food: { icon: Utensils, color: "text-emerald-300", gradient: "from-emerald-400 to-teal-300" },
  Travel: { icon: Plane, color: "text-cyan-300", gradient: "from-cyan-400 to-sky-300" },
  Shopping: { icon: ShoppingBag, color: "text-fuchsia-300", gradient: "from-fuchsia-400 to-pink-300" },
  Education: { icon: GraduationCap, color: "text-violet-300", gradient: "from-violet-400 to-indigo-300" },
  Bills: { icon: ReceiptText, color: "text-amber-300", gradient: "from-amber-300 to-orange-300" },
  Entertainment: { icon: Clapperboard, color: "text-rose-300", gradient: "from-rose-400 to-orange-300" },
  Health: { icon: HeartPulse, color: "text-lime-300", gradient: "from-lime-300 to-emerald-300" },
  Others: { icon: BookOpen, color: "text-slate-300", gradient: "from-slate-300 to-slate-100" },
};

export function CategoryPill({ category, compact = false }: { category: Category; compact?: boolean }) {
  const Icon = categoryMeta[category]?.icon ?? Sparkles;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 font-medium light:border-slate-200 light:bg-slate-100",
        compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm",
      )}
    >
      <Icon className={cn("h-3.5 w-3.5", categoryMeta[category]?.color)} />
      {category}
    </span>
  );
}
