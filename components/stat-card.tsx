"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/animated-number";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  helper: string;
  icon: LucideIcon;
  tone: string;
};

export function StatCard({ title, value, prefix, suffix, helper, icon: Icon, tone }: StatCardProps) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
      <Card className="relative min-h-[156px] overflow-hidden p-5">
        <div className={cn("absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br opacity-20 blur-2xl", tone)} />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-3 text-3xl font-semibold tracking-normal text-foreground">
              <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
            </p>
          </div>
          <div className={cn("rounded-md bg-gradient-to-br p-3 text-slate-950 shadow-glow", tone)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">{helper}</p>
      </Card>
    </motion.div>
  );
}
