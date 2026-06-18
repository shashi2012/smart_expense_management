"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, ChartPie, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { getCategoryTotals, getMonthlyTotals, getTrendData } from "@/lib/analytics";
import type { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const chartColors = ["#34d399", "#22d3ee", "#f0abfc", "#a78bfa", "#fbbf24", "#fb7185", "#bef264", "#cbd5e1"];

const tooltipStyle = {
  backgroundColor: "rgba(2, 6, 23, 0.96)",
  border: "1px solid rgba(148, 163, 184, 0.22)",
  borderRadius: "8px",
  boxShadow: "0 18px 50px rgba(0, 0, 0, 0.38)",
  color: "#ecfeff",
};

const tooltipLabelStyle = {
  color: "#a7f3d0",
  fontWeight: 700,
};

const tooltipItemStyle = {
  color: "#ecfeff",
  fontWeight: 600,
};

export function AnalyticsCharts({ expenses }: { expenses: Expense[] }) {
  const categoryTotals = getCategoryTotals(expenses);
  const monthlyTotals = getMonthlyTotals(expenses);
  const trendData = getTrendData(expenses);
  const hasData = expenses.length > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55 }}
      className="grid gap-5 xl:grid-cols-3"
    >
      <Card className="xl:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Category Spend</CardTitle>
              <CardDescription>Pie chart by expense category.</CardDescription>
            </div>
            <ChartPie className="h-5 w-5 text-emerald-300" />
          </div>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <EmptyState title="No chart data yet." description="Add an expense to see category analytics." />
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryTotals}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={62}
                    outerRadius={106}
                    paddingAngle={4}
                    animationBegin={80}
                    animationDuration={900}
                  >
                    {categoryTotals.map((entry, index) => (
                      <Cell key={entry.category} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(Number(value)), name]}
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    itemStyle={tooltipItemStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="xl:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Monthly Expenses</CardTitle>
              <CardDescription>Six-month spending bar chart.</CardDescription>
            </div>
            <BarChart3 className="h-5 w-5 text-cyan-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTotals} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={tooltipStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} animationDuration={950}>
                  {monthlyTotals.map((entry, index) => (
                    <Cell key={entry.month} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Expense Trends</CardTitle>
              <CardDescription>Recent transaction trend line.</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-sky-300" />
          </div>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <EmptyState title="No trends yet." description="Your spending trend appears after the first expense." />
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.55} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    itemStyle={tooltipItemStyle}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    fill="url(#trendGradient)"
                    animationDuration={950}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
}
