interface TabButtonProps {
  label: string;
  value: string;
  isSelected: boolean;
  setSelectedTab: (tab: string) => void;
}

export default function TabButton({
  label,
  value,
  isSelected,
  setSelectedTab,
}: TabButtonProps) {
  return (
    <button
      className={`bg-brand-neutral-dark/50 text-xl font-bold text-brand-neutral-light border border-brand-depth rounded-t-xl py-2 px-4
                                  hover:bg-brand-neutral-dark/70 cursor-pointer transition-colors duration-150 ${
                                    isSelected ? "bg-brand-neutral-dark/70" : ""
                                  }`}
      onClick={() => setSelectedTab(value)}
    >
      {label}
    </button>
  );
}
