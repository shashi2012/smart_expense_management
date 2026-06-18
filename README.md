# Smart Expense Manager

### Track • Analyze • Save Smarter

A premium fintech-inspired expense management application built with modern web technologies. Smart Expense Manager helps users track expenses, analyze spending habits, manage budgets, monitor subscriptions, and achieve savings goals through an elegant and interactive SaaS-style dashboard.

Designed with a focus on user experience, beautiful visualizations, and intelligent insights, the application delivers a polished product experience similar to modern platforms such as Linear, Stripe, Notion, and Vercel.

---

## Live Features

### Dashboard Overview

Get a real-time snapshot of your financial health through dynamic metrics:

* Total Expenses
* This Month's Spending
* Savings Goal Progress
* Expense Health Score

All values are automatically calculated from user data.

---

### Expense Management

Easily manage your daily expenses.

#### Add Expense

Supported fields:

* Amount
* Category
* Date
* Description

#### Categories

* Food
* Travel
* Shopping
* Education
* Bills
* Entertainment
* Health
* Others

Features include:

* Form validation
* Local persistence
* Instant updates

---

### Expense Tracking Table

Track every transaction in a clean and responsive interface.

Features:

* Search expenses
* Category filtering
* Delete transactions
* Responsive data table
* Real-time updates

Displayed information:

* Date
* Category
* Description
* Amount

---

### Analytics Dashboard

Visualize spending patterns using interactive charts.

#### Category Distribution

Pie Chart showing:

* Food
* Travel
* Shopping
* Bills
* Entertainment
* Health
* Education
* Others

#### Monthly Expense Analysis

Bar Chart displaying monthly spending trends.

#### Spending Trends

Line Chart for expense growth and behavioral analysis.

Built using Recharts.

---

### Budget Management

Set and monitor your monthly budget.

Example:

Budget = ₹10,000

Displays:

* Total Budget
* Amount Used
* Remaining Balance
* Progress Percentage

#### Budget Alerts

When usage exceeds:

**80%**

```text
⚠ Budget usage exceeds 80%
```

When usage exceeds:

**100%**

```text
🚨 Budget limit exceeded
```

---

### Savings Goals

Create and monitor personal financial goals.

Supported fields:

* Goal Name
* Target Amount
* Current Savings

Automatically calculates:

* Progress Percentage
* Remaining Amount
* Goal Completion Status

---

### Subscription Tracker

Track recurring monthly expenses.

Examples:

* Netflix
* Spotify
* Amazon Prime
* Gym Membership

Calculates:

* Monthly Subscription Cost
* Yearly Subscription Cost

Provides a complete overview of recurring financial commitments.

---

### AI-like Spending Insights

An intelligent insights engine generates meaningful observations from actual expense data.

Examples:

* You spent 42% of your budget on food.
* Shopping is your highest spending category.
* Travel spending increased compared to last month.
* Most spending occurs during weekends.
* Potential monthly savings identified.

Insights are generated dynamically based on recorded expenses.

---

### Beautiful Empty States

Designed empty screens guide users when no data exists.

Examples:

```text
No expenses added yet.
Start tracking your spending today.
```

---

### Local Storage Persistence

All application data is stored locally.

Persisted data:

* Expenses
* Budgets
* Savings Goals
* Subscriptions
* User Preferences

Data remains available after page refresh.

---

### Responsive Experience

Optimized for:

* Mobile Devices
* Tablets
* Laptops
* Desktop Screens

No horizontal scrolling.

Consistent user experience across all screen sizes.

---

## Technology Stack

### Framework

* Next.js 15 (App Router)

### Language

* TypeScript

### Styling

* Tailwind CSS
* shadcn/ui

### Animations

* Framer Motion

### Charts

* Recharts

### Icons

* Lucide React

### Storage

* Browser LocalStorage

---

## Design Philosophy

Smart Expense Manager follows a premium SaaS design system inspired by:

* Linear
* Stripe
* Vercel
* Notion
* Arc Browser

### Design Features

* Dark Mode First
* Glassmorphism Cards
* Emerald + Cyan Gradients
* Soft Shadows
* Smooth Hover Effects
* Elegant Typography
* Animated Data Visualization

---

## Project Structure

```text
src/
│
├── app/
├── components/
│   ├── dashboard/
│   ├── analytics/
│   ├── budget/
│   ├── goals/
│   ├── subscriptions/
│   └── ui/
│
├── hooks/
├── lib/
├── types/
├── utils/
└── data/
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Navigate to Project

```bash
cd smart-expense-manager
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Build Production Version

```bash
npm run build
```

```bash
npm start
```

---


## Bonus Features

* CSV Export
* Expense Import
* Dark / Light Theme Toggle
* Animated Counters
* Recent Activity Feed
* Category Icons
* Monthly Reports

---

## Objective

The goal of this project is to demonstrate the ability to design and build a polished, production-ready fintech SaaS application with modern UI/UX practices, strong frontend architecture, responsive design, and intelligent data visualization.

---


