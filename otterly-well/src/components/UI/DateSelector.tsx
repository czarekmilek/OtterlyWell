import React from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    onDateChange(newDate);
  };

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
    if (isToday(date)) return "Dzisiaj";
    if (isYesterday(date)) return "Wczoraj";
    return date.toLocaleDateString("pl-PL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex items-center justify-between bg-brand-neutral-dark/50 border border-brand-depth rounded-xl p-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePrevDay}
        className="flex items-center justify-center p-2 hover:bg-brand-accent-3 cursor-pointer rounded-full 
                text-brand-neutral-light transition-colors"
      >
        <ChevronLeftIcon className="text-2xl" />
      </motion.button>

      <span className="text-lg text-center font-medium text-brand-neutral-light capitalize">
        {formatDate(selectedDate)}
      </span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleNextDay}
        className="flex items-center justify-center p-2 hover:bg-brand-accent-3 cursor-pointer rounded-full 
                  text-brand-neutral-light transition-colors"
      >
        <ChevronRightIcon className="text-2xl" />
      </motion.button>
    </div>
  );
};
