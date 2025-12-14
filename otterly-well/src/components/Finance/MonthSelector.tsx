import React from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";

interface MonthSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const currentMonthFormatter = new Intl.DateTimeFormat("pl-PL", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between bg-brand-neutral-dark/50 border border-brand-depth rounded-xl py-3 px-4 min-w-72">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePrevMonth}
        className="flex items-center justify-center p-1 hover:bg-brand-accent-3/20 cursor-pointer rounded-full 
                text-brand-neutral-light transition-colors"
      >
        <ChevronLeftIcon className="text-2xl" />
      </motion.button>

      <span className="text-lg text-center font-bold text-brand-neutral-light capitalize tracking-wide">
        {currentMonthFormatter.format(selectedDate)}
      </span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleNextMonth}
        className="flex items-center justify-center p-1 hover:bg-brand-accent-3/20 cursor-pointer rounded-full 
                  text-brand-neutral-light transition-colors"
      >
        <ChevronRightIcon className="text-2xl" />
      </motion.button>
    </div>
  );
};
