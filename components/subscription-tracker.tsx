"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Repeat2, Trash2 } from "lucide-react";
import { CategoryPill } from "@/components/category-pill";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, type Category, type Subscription } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type SubscriptionTrackerProps = {
  subscriptions: Subscription[];
  onAdd: (subscription: Omit<Subscription, "id">) => void;
  onDelete: (id: string) => void;
};

export function SubscriptionTracker({ subscriptions, onAdd, onDelete }: SubscriptionTrackerProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Entertainment");
  const monthlyTotal = subscriptions.reduce((total, subscription) => total + subscription.amount, 0);
  const yearlyTotal = monthlyTotal * 12;

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!name.trim() || !numericAmount || numericAmount <= 0) return;
    onAdd({ name: name.trim(), amount: numericAmount, category });
    setName("");
    setAmount("");
    setCategory("Entertainment");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Subscription Tracker</CardTitle>
              <CardDescription>Monitor recurring costs before they quietly compound.</CardDescription>
            </div>
            <Repeat2 className="h-5 w-5 text-emerald-300" />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4 light:border-slate-200 light:bg-slate-50">
              <p className="text-sm text-muted-foreground">Monthly Subscription Cost</p>
              <p className="mt-2 text-2xl font-semibold">{formatCurrency(monthlyTotal)}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4 light:border-slate-200 light:bg-slate-50">
              <p className="text-sm text-muted-foreground">Yearly Subscription Cost</p>
              <p className="mt-2 text-2xl font-semibold">{formatCurrency(yearlyTotal)}</p>
            </div>
          </div>

          <form className="grid gap-3 lg:grid-cols-[1fr_150px_180px_auto]" onSubmit={handleAdd}>
            <div className="grid gap-2">
              <Label htmlFor="subscriptionName">Name</Label>
              <Input
                id="subscriptionName"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Netflix, Spotify, Prime, Gym"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subscriptionAmount">Amount</Label>
              <Input
                id="subscriptionAmount"
                type="number"
                min="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="499"
              />
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="group self-end">
              Add
            </Button>
          </form>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {subscriptions.map((subscription) => (
              <motion.div
                key={subscription.id}
                layout
                whileHover={{ y: -4, scale: 1.01 }}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-4 light:border-slate-200 light:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{subscription.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(subscription.amount)} / month</p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => onDelete(subscription.id)} aria-label={`Delete ${subscription.name}`}>
                    <Trash2 className="h-4 w-4 text-red-300" />
                  </Button>
                </div>
                <div className="mt-4">
                  <CategoryPill category={subscription.category} compact />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
