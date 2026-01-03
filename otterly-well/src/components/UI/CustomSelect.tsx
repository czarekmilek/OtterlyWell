import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "../icons";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  icon?: React.ReactNode;
}

export default function CustomSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Wybierz...",
  icon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      {label && (
        <label className="text-sm text-brand-neutral-light">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full p-3 rounded-lg bg-brand-neutral-dark border transition-colors flex items-center justify-between
                     focus:outline-none focus:ring-1 focus:ring-brand-accent-1
                     ${
                       isOpen
                         ? "border-brand-accent-1 ring-1 ring-brand-accent-1"
                         : "border-brand-depth hover:border-brand-neutral-light/30"
                     }`}
        >
          <div className="flex items-center gap-2 text-brand-neutral-light overflow-hidden">
            {icon && (
              <span className="text-brand-neutral-light/70">{icon}</span>
            )}
            <span className="truncate text-sm md:text-base">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDownIcon
            className={`text-brand-neutral-light/50 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-1 bg-brand-neutral-dark border border-brand-depth rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar"
            >
              <ul className="py-1">
                {options.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`px-3 py-2 cursor-pointer transition-colors flex items-center justify-between
                               ${
                                 option.value === value
                                   ? "bg-brand-accent-1/20 text-brand-accent-1"
                                   : "text-brand-neutral-light hover:bg-brand-depth/50"
                               }`}
                  >
                    <span>{option.label}</span>
                    {option.value === value && (
                      <span className="w-2 h-2 rounded-full bg-brand-accent-1" />
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
