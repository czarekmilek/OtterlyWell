import { motion } from "framer-motion";
import React from "react";

interface StatsCardProps {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  type: "positive" | "negative" | "neutral";
}

export function StatsCard({ label, value, unit, icon, type }: StatsCardProps) {
  let colorClass = "text-brand-neutral-light";
  let bgClass = "bg-brand-neutral-dark";

  if (type === "positive") colorClass = "text-brand-positive-lighter";
  if (type === "negative") colorClass = "text-brand-negative";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className={`${bgClass} p-4 border border-brand-depth rounded-xl w-full`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="text-brand-secondary/70 transform scale-83">{icon}</div>
        <p className="text-xs text-brand-neutral-light/70 uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className={`text-2xl font-bold ${colorClass}`}>
        {value.toFixed(0)}
        <span className="text-lg font-normal text-brand-secondary ml-1">
          {unit}
        </span>
      </p>
    </motion.div>
  );
}
