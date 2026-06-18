import type { Expense, Subscription } from "@/lib/types";

const now = new Date();
const y = now.getFullYear();
const m = now.getMonth();

function iso(year: number, month: number, day: number) {
  return new Date(year, month, day).toISOString().slice(0, 10);
}

export const starterExpenses: Expense[] = [
  { id: "exp-1", amount: 750, category: "Food", date: iso(y, m, 2), description: "Groceries and breakfast" },
  { id: "exp-2", amount: 900, category: "Travel", date: iso(y, m, 5), description: "Metro card recharge" },
  { id: "exp-3", amount: 1400, category: "Shopping", date: iso(y, m, 8), description: "Work essentials" },
  { id: "exp-4", amount: 1000, category: "Education", date: iso(y, m, 12), description: "Online course" },
  { id: "exp-5", amount: 1550, category: "Bills", date: iso(y, m, 15), description: "Electricity and internet" },
  { id: "exp-6", amount: 950, category: "Entertainment", date: iso(y, m - 1, 17), description: "Movie night" },
  { id: "exp-7", amount: 1200, category: "Health", date: iso(y, m - 1, 23), description: "Pharmacy" },
  { id: "exp-8", amount: 1700, category: "Food", date: iso(y, m - 1, 11), description: "Dining out" },
  { id: "exp-9", amount: 1500, category: "Travel", date: iso(y, m - 2, 18), description: "Weekend commute" },
  { id: "exp-10", amount: 1500, category: "Others", date: iso(y, m - 2, 7), description: "Home supplies" },
];

export const starterSubscriptions: Subscription[] = [
  { id: "sub-1", name: "Netflix", amount: 649, category: "Entertainment" },
  { id: "sub-2", name: "Spotify", amount: 119, category: "Entertainment" },
  { id: "sub-3", name: "Prime", amount: 299, category: "Shopping" },
  { id: "sub-4", name: "Gym", amount: 1500, category: "Health" },
];
