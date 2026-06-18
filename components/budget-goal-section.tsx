"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Goal, PiggyBank, Save, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { Budget, SavingsGoal } from "@/lib/types";
import { clamp, formatCurrency } from "@/lib/utils";

type BudgetGoalSectionProps = {
  budget: Budget;
  goal: SavingsGoal;
  monthlySpent: number;
  onBudgetChange: (budget: Budget) => void;
  onGoalChange: (goal: SavingsGoal) => void;
};

export function BudgetGoalSection({ budget, goal, monthlySpent, onBudgetChange, onGoalChange }: BudgetGoalSectionProps) {
  const [budgetValue, setBudgetValue] = useState(String(budget.monthly));
  const [goalValue, setGoalValue] = useState(goal);
  const budgetUsage = budget.monthly > 0 ? (monthlySpent / budget.monthly) * 100 : 0;
  const remainingBudget = budget.monthly - monthlySpent;
  const goalProgress = goal.targetAmount > 0 ? (goal.currentSavings / goal.targetAmount) * 100 : 0;

  function saveBudget() {
    onBudgetChange({ monthly: Math.max(0, Number(budgetValue)) });
  }

  function saveGoal() {
    onGoalChange({
      name: goalValue.name.trim() || "Emergency Fund",
      targetAmount: Math.max(0, Number(goalValue.targetAmount)),
      currentSavings: Math.max(0, Number(goalValue.currentSavings)),
    });
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55 }}
      className="grid gap-5 lg:grid-cols-2"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Budget Management</CardTitle>
              <CardDescription>Set your monthly budget and watch usage in real time.</CardDescription>
            </div>
            <PiggyBank className="h-5 w-5 text-emerald-300" />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="grid gap-2">
              <Label htmlFor="monthlyBudget">Monthly Budget</Label>
              <Input
                id="monthlyBudget"
                type="number"
                min="0"
                value={budgetValue}
                onChange={(event) => setBudgetValue(event.target.value)}
              />
            </div>
            <Button type="button" className="group self-end w-full sm:w-auto" onClick={saveBudget}>
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 light:border-slate-200 light:bg-slate-50">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Used amount</span>
              <span className="font-semibold">{formatCurrency(monthlySpent)}</span>
            </div>
            <Progress value={clamp(budgetUsage)} indicatorClassName={budgetUsage > 100 ? "from-red-400 to-rose-400" : budgetUsage > 80 ? "from-amber-300 to-orange-400" : undefined} />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Remaining amount</span>
              <span className={remainingBudget < 0 ? "font-semibold text-red-300" : "font-semibold text-emerald-300"}>
                {formatCurrency(remainingBudget)}
              </span>
            </div>
          </div>
          {budgetUsage > 100 ? (
            <div className="flex items-center gap-3 rounded-lg border border-red-400/20 bg-red-400/10 p-4 text-sm font-medium text-red-200">
              <ShieldAlert className="h-5 w-5" />
              🚨 Budget limit exceeded
            </div>
          ) : budgetUsage > 80 ? (
            <div className="flex items-center gap-3 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm font-medium text-amber-100">
              <AlertTriangle className="h-5 w-5" />
              ⚠ Budget usage exceeds 80%
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Savings Goal</CardTitle>
              <CardDescription>Plan a target and measure progress toward it.</CardDescription>
            </div>
            <Goal className="h-5 w-5 text-cyan-300" />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="grid gap-2 md:col-span-3">
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                value={goalValue.name}
                onChange={(event) => setGoalValue((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input
                id="targetAmount"
                type="number"
                min="0"
                value={goalValue.targetAmount}
                onChange={(event) => setGoalValue((current) => ({ ...current, targetAmount: Number(event.target.value) }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currentSavings">Current Savings</Label>
              <Input
                id="currentSavings"
                type="number"
                min="0"
                value={goalValue.currentSavings}
                onChange={(event) => setGoalValue((current) => ({ ...current, currentSavings: Number(event.target.value) }))}
              />
            </div>
            <Button type="button" className="group self-end w-full md:w-auto" onClick={saveGoal}>
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 light:border-slate-200 light:bg-slate-50">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-semibold">{goal.name}</span>
              <span className="text-sm font-semibold text-cyan-200">{Math.round(clamp(goalProgress))}%</span>
            </div>
            <Progress value={clamp(goalProgress)} />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Remaining amount</span>
              <span className="font-semibold">{formatCurrency(Math.max(goal.targetAmount - goal.currentSavings, 0))}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
