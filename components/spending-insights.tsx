"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategoryTotals, getLargestCategory, getWeekendShare, previousMonth, sameMonth, sum } from "@/lib/analytics";
import type { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type SpendingInsightsProps = {
  expenses: Expense[];
  monthlyBudget: number;
};

export function SpendingInsights({ expenses, monthlyBudget }: SpendingInsightsProps) {
  const currentMonthExpenses = expenses.filter((expense) => sameMonth(expense));
  const previousMonthExpenses = expenses.filter((expense) => previousMonth(expense));
  const foodTotal = sum(currentMonthExpenses.filter((expense) => expense.category === "Food").map((expense) => expense.amount));
  const currentTravel = sum(currentMonthExpenses.filter((expense) => expense.category === "Travel").map((expense) => expense.amount));
  const previousTravel = sum(previousMonthExpenses.filter((expense) => expense.category === "Travel").map((expense) => expense.amount));
  const largest = getLargestCategory(expenses);
  const categoryTotals = getCategoryTotals(currentMonthExpenses);
  const discretionary = sum(
    currentMonthExpenses
      .filter((expense) => ["Food", "Shopping", "Entertainment", "Others"].includes(expense.category))
      .map((expense) => expense.amount),
  );
  const potentialSavings = Math.round((discretionary * 0.15) / 100) * 100;
  const foodBudgetShare = monthlyBudget > 0 ? Math.round((foodTotal / monthlyBudget) * 100) : 0;
  const travelChange = previousTravel > 0 ? Math.round(((currentTravel - previousTravel) / previousTravel) * 100) : currentTravel > 0 ? 100 : 0;
  const weekendShare = getWeekendShare(expenses);

  const insights = expenses.length
    ? [
        `You spent ${foodBudgetShare}% of your budget on food this month.`,
        `Travel spending ${travelChange >= 0 ? "increased" : "decreased"} by ${Math.abs(travelChange)}% compared to last month.`,
        `Your largest expense category is ${largest.category}.`,
        `Potential monthly savings: ${formatCurrency(potentialSavings)}.`,
        `Most spending${weekendShare >= 45 ? "" : " does not"} occurs on weekends (${weekendShare}% of tracked spend).`,
      ]
    : [
        "No expenses added yet. Start tracking your spending today.",
        "Your AI-like insights will update after your first transaction.",
      ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.55 }}
    >
      <Card className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
        <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/3 rounded-full bg-cyan-400/10 blur-3xl" />
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Badge className="border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  AI-like Spending Insights
                </Badge>
              </div>
              <CardTitle className="text-2xl">Your financial co-pilot</CardTitle>
              <CardDescription>Generated dynamically from your real expense, budget, and category patterns.</CardDescription>
            </div>
            <div className="rounded-md bg-gradient-to-br from-emerald-300 to-cyan-300 p-3 text-slate-950 shadow-glow">
              <BrainCircuit className="h-6 w-6" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {insights.map((insight, index) => (
              <motion.div
                key={insight}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="rounded-lg border border-white/10 bg-slate-950/35 p-4 text-sm leading-6 light:border-slate-200 light:bg-white/80"
              >
                <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-cyan-200 light:bg-slate-100 light:text-cyan-700">
                  {index + 1}
                </span>
                {insight}
              </motion.div>
            ))}
          </div>
          {categoryTotals.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {categoryTotals.slice(0, 5).map((item) => (
                <Badge key={item.category}>
                  {item.category}: {formatCurrency(item.amount)}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.section>
  );
}
