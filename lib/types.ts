export const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Education",
  "Bills",
  "Entertainment",
  "Health",
  "Others",
] as const;

export type Category = (typeof categories)[number];

export type Expense = {
  id: string;
  amount: number;
  category: Category;
  date: string;
  description: string;
};

export type Budget = {
  monthly: number;
};

export type SavingsGoal = {
  name: string;
  targetAmount: number;
  currentSavings: number;
};

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  category: Category;
};

export type AppSettings = {
  theme: "dark" | "light";
};

export type ExpenseFormValues = Omit<Expense, "id">;
