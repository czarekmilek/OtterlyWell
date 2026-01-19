interface TabButtonProps {
  label: string;
  value: string;
  isSelected: boolean;
  setSelectedTab: (tab: string) => void;
  disabled?: boolean;
}

// TODO: utilise wherever possible
export default function TabButton({
  label,
  value,
  isSelected,
  setSelectedTab,
  disabled = false,
}: TabButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`bg-brand-neutral-dark/50 text-xl font-bold text-brand-neutral-light border border-brand-depth rounded-t-xl py-2 px-4
                                  transition-colors duration-150 ${
                                    disabled
                                      ? "opacity-30 cursor-not-allowed"
                                      : "cursor-pointer hover:bg-brand-neutral-dark/70"
                                  } ${
        isSelected && !disabled ? "bg-brand-neutral-dark/70" : ""
      } ${!isSelected && !disabled ? "opacity-70 hover:opacity-100" : ""}`}
      onClick={() => !disabled && setSelectedTab(value)}
    >
      {label}
    </button>
  );
}
