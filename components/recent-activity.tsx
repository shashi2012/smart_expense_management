"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { CategoryPill } from "@/components/category-pill";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Expense } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function RecentActivity({ expenses }: { expenses: Expense[] }) {
  const recent = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55 }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest spending updates.</CardDescription>
            </div>
            <Activity className="h-5 w-5 text-cyan-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recent.map((expense) => (
              <div key={expense.id} className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 light:border-slate-200 light:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{expense.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(expense.date)}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 sm:shrink-0 sm:justify-start">
                  <CategoryPill category={expense.category} compact />
                  <span className="text-sm font-semibold">{formatCurrency(expense.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
