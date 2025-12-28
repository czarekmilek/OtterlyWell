import React from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "../../icons";

interface DaySelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

// this is exactly the same as MonthSelector - it worked well in finance
// TODO: use this also in old modules
export const DaySelector: React.FC<DaySelectorProps> = ({
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

  const currentDateFormatter = new Intl.DateTimeFormat("pl-PL", {
    day: "numeric", // only added this
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between bg-brand-neutral-dark/50 border border-brand-depth rounded-xl py-3 px-4 min-w-72">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePrevDay}
        className="flex items-center justify-center p-1 hover:bg-brand-accent-3/20 cursor-pointer rounded-full 
                text-brand-neutral-light transition-colors"
      >
        <ChevronLeftIcon className="text-2xl" />
      </motion.button>

      <span className="text-lg text-center font-bold text-brand-neutral-light capitalize tracking-wide">
        {currentDateFormatter.format(selectedDate)}
      </span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleNextDay}
        className="flex items-center justify-center p-1 hover:bg-brand-accent-3/20 cursor-pointer rounded-full 
                  text-brand-neutral-light transition-colors"
      >
        <ChevronRightIcon className="text-2xl" />
      </motion.button>
    </div>
  );
};
