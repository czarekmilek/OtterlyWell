export const DEFAULT_CATEGORY_COLOR = "#9ca3af"; // gray-400

export const CATEGORY_COLORS: Record<string, string> = {
  // expense
  Rachunki: "#f87171", // red-400
  Transport: "#fb923c", // orange-400
  Jedzenie: "#fbbf24", // amber-400
  Codzienne: "#2dd4bf", // teal-400
  Zdrowie: "#34d399", // emerald-400
  Dom: "#60a5fa", // blue-400
  Samorozwój: "#f472b6", // pink-400
  Rozrywka: "#e879f9", // fuchsia-400

  // income
  Wynagrodzenie: "#4ade80", // green-400
  Inwestycje: "#818cf8", // indigo-400

  Inne: "#9ca3af", // gray-400
};

export const getCategoryColor = (categoryName?: string | null): string => {
  if (!categoryName) return DEFAULT_CATEGORY_COLOR;
  return CATEGORY_COLORS[categoryName] || DEFAULT_CATEGORY_COLOR;
};
