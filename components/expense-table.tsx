"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Filter, Search, Trash2, Upload } from "lucide-react";
import { CategoryPill } from "@/components/category-pill";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, type Category, type Expense } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

type ExpenseTableProps = {
  expenses: Expense[];
  search: string;
  filter: Category | "All";
  onSearchChange: (value: string) => void;
  onFilterChange: (value: Category | "All") => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onImport: (file: File) => void;
};

export function ExpenseTable({
  expenses,
  search,
  filter,
  onSearchChange,
  onFilterChange,
  onDelete,
  onExport,
  onImport,
}: ExpenseTableProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const filteredExpenses = useMemo(() => {
    const term = search.trim().toLowerCase();
    return expenses
      .filter((expense) => (filter === "All" ? true : expense.category === filter))
      .filter((expense) => {
        if (!term) return true;
        return (
          expense.description.toLowerCase().includes(term) ||
          expense.category.toLowerCase().includes(term) ||
          String(expense.amount).includes(term)
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filter, search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.55 }}
    >
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>Expense Table</CardTitle>
              <CardDescription>Search, filter, import, export, and delete transactions.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onImport(file);
                  event.currentTarget.value = "";
                }}
              />
              <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()} className="group">
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <Button type="button" variant="secondary" onClick={onExport} className="group">
                <Download className="h-4 w-4" />
                CSV Export
              </Button>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search by description, category, or amount"
                className="pl-9"
              />
            </div>
            <Select value={filter} onValueChange={(value) => onFilterChange(value as Category | "All")}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-hidden rounded-lg border border-white/10 light:border-slate-200">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-white/[0.06] text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    <tr>
                      <th className="px-4 py-4 font-medium">Date</th>
                      <th className="px-4 py-4 font-medium">Category</th>
                      <th className="px-4 py-4 font-medium">Description</th>
                      <th className="px-4 py-4 text-right font-medium">Amount</th>
                      <th className="px-4 py-4 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 light:divide-slate-200">
                    {filteredExpenses.map((expense) => (
                      <motion.tr
                        key={expense.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="transition-colors hover:bg-white/[0.045]"
                      >
                        <td className="px-4 py-4 text-muted-foreground">{formatDate(expense.date)}</td>
                        <td className="px-4 py-4">
                          <CategoryPill category={expense.category} compact />
                        </td>
                        <td className="px-4 py-4 font-medium">{expense.description}</td>
                        <td className="px-4 py-4 text-right font-semibold">{formatCurrency(expense.amount)}</td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${expense.description}`}
                            onClick={() => onDelete(expense.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-300" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
