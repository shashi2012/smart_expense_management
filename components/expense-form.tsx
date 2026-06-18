"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, IndianRupee, Plus, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, type Category, type ExpenseFormValues } from "@/lib/types";

type ExpenseFormProps = {
  onAddExpense: (expense: ExpenseFormValues) => void;
};

type Errors = Partial<Record<keyof ExpenseFormValues, string>>;

const today = new Date().toISOString().slice(0, 10);

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const initialValues = useMemo<ExpenseFormValues>(
    () => ({
      amount: 0,
      category: "Food",
      date: today,
      description: "",
    }),
    [],
  );
  const [values, setValues] = useState<ExpenseFormValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});

  function validate() {
    const nextErrors: Errors = {};
    if (!values.amount || values.amount <= 0) nextErrors.amount = "Enter a valid amount.";
    if (!values.date) nextErrors.date = "Choose a date.";
    if (!values.description.trim()) nextErrors.description = "Add a short description.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    onAddExpense({
      ...values,
      amount: Number(values.amount),
      description: values.description.trim(),
    });
    setValues(initialValues);
    setErrors({});
  }

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
              <CardTitle>Add Expense</CardTitle>
              <CardDescription>Capture every transaction in a few seconds.</CardDescription>
            </div>
            <div className="rounded-md bg-emerald-400/15 p-3 text-emerald-300">
              <ReceiptText className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="amount"
                  min="1"
                  step="1"
                  type="number"
                  value={values.amount || ""}
                  onChange={(event) => setValues((current) => ({ ...current, amount: Number(event.target.value) }))}
                  className="pl-9"
                  placeholder="1250"
                />
              </div>
              {errors.amount ? <p className="text-xs text-red-300">{errors.amount}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={values.category}
                onValueChange={(category) => setValues((current) => ({ ...current, category: category as Category }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={values.date}
                  onChange={(event) => setValues((current) => ({ ...current, date: event.target.value }))}
                  className="pl-9"
                />
              </div>
              {errors.date ? <p className="text-xs text-red-300">{errors.date}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={values.description}
                onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
                placeholder="Lunch, metro pass, course fee..."
              />
              {errors.description ? <p className="text-xs text-red-300">{errors.description}</p> : null}
            </div>

            <Button type="submit" className="group mt-2 w-full">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
