"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeIndianRupee,
  LineChart,
  Moon,
  ShieldCheck,
  Sun,
  Target,
  Wallet,
} from "lucide-react";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { BudgetGoalSection } from "@/components/budget-goal-section";
import { ExpenseForm } from "@/components/expense-form";
import { ExpenseTable } from "@/components/expense-table";
import { RecentActivity } from "@/components/recent-activity";
import { SpendingInsights } from "@/components/spending-insights";
import { StatCard } from "@/components/stat-card";
import { SubscriptionTracker } from "@/components/subscription-tracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getExpenseHealthScore, sameMonth, sum } from "@/lib/analytics";
import { starterExpenses, starterSubscriptions } from "@/lib/demo-data";
import type { AppSettings, Budget, Category, Expense, ExpenseFormValues, SavingsGoal, Subscription } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const defaultBudget: Budget = { monthly: 10000 };
const defaultGoal: SavingsGoal = {
  name: "Emergency Fund",
  targetAmount: 50000,
  currentSavings: 32500,
};
const defaultSettings: AppSettings = { theme: "dark" };

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function csvEscape(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function parseCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export function SmartExpenseManager() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("sem-expenses", starterExpenses);
  const [budget, setBudget] = useLocalStorage<Budget>("sem-budget", defaultBudget);
  const [goal, setGoal] = useLocalStorage<SavingsGoal>("sem-goal", defaultGoal);
  const [subscriptions, setSubscriptions] = useLocalStorage<Subscription[]>("sem-subscriptions", starterSubscriptions);
  const [settings, setSettings] = useLocalStorage<AppSettings>("sem-settings", defaultSettings);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Category | "All">("All");

  const monthlyExpenses = useMemo(() => expenses.filter((expense) => sameMonth(expense)), [expenses]);
  const totalExpenseAmount = useMemo(() => sum(expenses.map((expense) => expense.amount)), [expenses]);
  const monthlyExpenseAmount = useMemo(() => sum(monthlyExpenses.map((expense) => expense.amount)), [monthlyExpenses]);
  const savingsProgress = goal.targetAmount > 0 ? Math.round((goal.currentSavings / goal.targetAmount) * 100) : 0;
  const healthScore = getExpenseHealthScore(expenses, budget.monthly);
  const isLight = settings.theme === "light";

  function addExpense(values: ExpenseFormValues) {
    setExpenses((current) => [{ ...values, id: createId("exp") }, ...current]);
  }

  function deleteExpense(id: string) {
    setExpenses((current) => current.filter((expense) => expense.id !== id));
  }

  function addSubscription(values: Omit<Subscription, "id">) {
    setSubscriptions((current) => [{ ...values, id: createId("sub") }, ...current]);
  }

  function deleteSubscription(id: string) {
    setSubscriptions((current) => current.filter((subscription) => subscription.id !== id));
  }

  function exportCsv() {
    const rows = [
      ["Date", "Category", "Description", "Amount"],
      ...expenses.map((expense) => [expense.date, expense.category, expense.description, expense.amount]),
    ];
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "smart-expense-manager.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function importCsv(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const lines = text.split(/\r?\n/).filter(Boolean);
      const imported = lines
        .slice(1)
        .map(parseCsvLine)
        .map(([date, category, description, amount]) => ({
          id: createId("exp"),
          date,
          category: category as Category,
          description,
          amount: Number(amount),
        }))
        .filter((expense) => expense.date && expense.description && Number.isFinite(expense.amount) && expense.amount > 0);

      if (imported.length) {
        setExpenses((current) => [...imported, ...current]);
      }
    };
    reader.readAsText(file);
  }

  function toggleTheme() {
    setSettings((current) => ({ theme: current.theme === "dark" ? "light" : "dark" }));
  }

  return (
    <main className={`${settings.theme} min-h-screen mesh-bg text-foreground`}>
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-emerald-300/10 to-transparent" />
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8"
      >
        <motion.header variants={itemVariants} className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-gradient-to-br from-emerald-300 to-cyan-300 p-3 text-slate-950 shadow-glow">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-normal sm:text-2xl">Smart Expense Manager</h1>
              <p className="text-sm text-muted-foreground">Track • Analyze • Save Smarter</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
              Local-first
            </Badge>
            <Button type="button" variant="secondary" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button asChild className="group">
              <a href="https://digitalheroesco.com" target="_blank" rel="noreferrer">
                Built for Digital Heroes
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </motion.header>

        <motion.section variants={itemVariants} className="grid gap-5 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="flex min-h-[360px] flex-col justify-between rounded-lg border border-white/10 bg-slate-950/30 p-6 shadow-card backdrop-blur-2xl light:bg-white/70 sm:p-8">
            <div>
              <Badge className="mb-5 border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                Premium finance dashboard
              </Badge>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl lg:text-6xl">
                Spend with clarity. <span className="gradient-text">Save with confidence.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                A tool for tracking expenses, understanding category trends, managing budgets, and surfacing actionable spending insights.
              </p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4 light:border-slate-200 light:bg-white">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Monthly Budget</p>
                <p className="mt-2 text-xl font-semibold">{formatCurrency(budget.monthly)}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4 light:border-slate-200 light:bg-white">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Transactions</p>
                <p className="mt-2 text-xl font-semibold">{expenses.length}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4 light:border-slate-200 light:bg-white">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Subscriptions</p>
                <p className="mt-2 text-xl font-semibold">{subscriptions.length}</p>
              </div>
            </div>
          </div>
          <RecentActivity expenses={expenses} />
        </motion.section>

        <motion.section variants={pageVariants} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <motion.div variants={itemVariants}>
            <StatCard
              title="Total Expenses"
              value={totalExpenseAmount}
              prefix="₹"
              helper="All tracked expenses"
              icon={BadgeIndianRupee}
              tone="from-emerald-300 to-cyan-300"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="This Month"
              value={monthlyExpenseAmount}
              prefix="₹"
              helper="Current month spend"
              icon={LineChart}
              tone="from-cyan-300 to-sky-300"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Savings Goal Progress"
              value={savingsProgress}
              suffix="%"
              helper={`${goal.name}: ${formatCurrency(goal.currentSavings)} saved`}
              icon={Target}
              tone="from-fuchsia-300 to-cyan-300"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Expense Health Score"
              value={healthScore}
              suffix="/100"
              helper="Budget usage and category balance"
              icon={ShieldCheck}
              tone="from-lime-300 to-emerald-300"
            />
          </motion.div>
        </motion.section>

        <section className="grid gap-5 xl:grid-cols-[380px_1fr]">
          <ExpenseForm onAddExpense={addExpense} />
          <ExpenseTable
            expenses={expenses}
            search={search}
            filter={filter}
            onSearchChange={setSearch}
            onFilterChange={setFilter}
            onDelete={deleteExpense}
            onExport={exportCsv}
            onImport={importCsv}
          />
        </section>

        <AnalyticsCharts expenses={expenses} />
        <BudgetGoalSection budget={budget} goal={goal} monthlySpent={monthlyExpenseAmount} onBudgetChange={setBudget} onGoalChange={setGoal} />
        <SubscriptionTracker subscriptions={subscriptions} onAdd={addSubscription} onDelete={deleteSubscription} />
        <SpendingInsights expenses={expenses} monthlyBudget={budget.monthly} />

       
      </motion.div>
    </main>
  );
}
