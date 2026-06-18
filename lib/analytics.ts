import { categories, type Category, type Expense } from "@/lib/types";
import { clamp } from "@/lib/utils";

export function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

type DateInput = string | { date: string };

function toDateValue(value: DateInput) {
  return typeof value === "string" ? value : value.date;
}

export function sameMonth(date: DateInput, reference = new Date()) {
  const current = new Date(toDateValue(date));
  return current.getMonth() === reference.getMonth() && current.getFullYear() === reference.getFullYear();
}

export function previousMonth(date: DateInput, reference = new Date()) {
  const current = new Date(toDateValue(date));
  const previous = new Date(reference.getFullYear(), reference.getMonth() - 1, 1);
  return current.getMonth() === previous.getMonth() && current.getFullYear() === previous.getFullYear();
}

export function getCategoryTotals(expenses: Expense[]) {
  return categories
    .map((category) => ({
      category,
      amount: sum(expenses.filter((expense) => expense.category === category).map((expense) => expense.amount)),
    }))
    .filter((item) => item.amount > 0);
}

export function getMonthlyTotals(expenses: Expense[]) {
  const formatter = new Intl.DateTimeFormat("en-IN", { month: "short" });
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: formatter.format(date),
      amount: 0,
    };
  });

  for (const expense of expenses) {
    const date = new Date(expense.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const month = months.find((item) => item.key === key);
    if (month) month.amount += expense.amount;
  }

  return months.map(({ month, amount }) => ({ month, amount }));
}

export function getTrendData(expenses: Expense[]) {
  return [...expenses]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-12)
    .map((expense) => ({
      date: new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(expense.date)),
      amount: expense.amount,
    }));
}

export function getLargestCategory(expenses: Expense[]) {
  const totals = getCategoryTotals(expenses);
  return totals.sort((a, b) => b.amount - a.amount)[0] ?? { category: "Others" as Category, amount: 0 };
}

export function getExpenseHealthScore(expenses: Expense[], monthlyBudget: number) {
  const monthExpenses = expenses.filter((expense) => sameMonth(expense));
  const monthlyTotal = sum(monthExpenses.map((expense) => expense.amount));
  const budgetUsage = monthlyBudget > 0 ? (monthlyTotal / monthlyBudget) * 100 : 0;
  const largest = getLargestCategory(monthExpenses);
  const concentration = monthlyTotal > 0 ? (largest.amount / monthlyTotal) * 100 : 0;
  const overspendPenalty = Math.max(0, budgetUsage - 65) * 0.6;
  const concentrationPenalty = Math.max(0, concentration - 35) * 0.35;

  return Math.round(clamp(100 - 12 - overspendPenalty - concentrationPenalty, 0, 100));
}

export function getWeekendShare(expenses: Expense[]) {
  const total = sum(expenses.map((expense) => expense.amount));
  const weekend = sum(
    expenses
      .filter((expense) => {
        const day = new Date(expense.date).getDay();
        return day === 0 || day === 6;
      })
      .map((expense) => expense.amount),
  );

  return total > 0 ? Math.round((weekend / total) * 100) : 0;
}
