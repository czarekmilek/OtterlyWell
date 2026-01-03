import React from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  format: "day" | "month";
}

// This selector was in Calories and Finance, now it uses similar styling as the one in Finance
// also, made it into both month and day, depending on flags provided
export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
  format,
}) => {
  const currentMonthFormatter = new Intl.DateTimeFormat("pl-PL", {
    month: "long",
    year: "numeric",
  });

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isYesterday = (date: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  };

  const formatDate = (date: Date) => {
    if (format === "month") return currentMonthFormatter.format(date);
    if (isToday(date)) return "Dzisiaj";
    if (isYesterday(date)) return "Wczoraj";
    return date.toLocaleDateString("pl-PL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDateChange = (increment: number) => {
    const newDate = new Date(selectedDate);
    if (format === "day") {
      newDate.setDate(selectedDate.getDate() + increment);
    } else {
      newDate.setMonth(selectedDate.getMonth() + increment);
    }
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-between bg-brand-neutral-dark/50 border border-brand-depth rounded-xl py-3 px-4 min-w-56 md:min-w-72">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleDateChange(-1)}
        className="flex items-center justify-center p-1 hover:bg-brand-accent-3/20 cursor-pointer rounded-full
                  text-brand-neutral-light transition-colors"
      >
        <ChevronLeftIcon className="text-2xl" />
      </motion.button>
      <span className="text-lg text-center font-bold text-brand-neutral-light capitalize tracking-wide">
        {formatDate(selectedDate)}
      </span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleDateChange(1)}
        className="flex items-center justify-center p-1 hover:bg-brand-accent-3/20 cursor-pointer rounded-full
                    text-brand-neutral-light transition-colors"
      >
        <ChevronRightIcon className="text-2xl" />
      </motion.button>
    </div>
  );
};
