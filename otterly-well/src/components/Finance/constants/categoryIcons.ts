// temporraily using material icons here
export const DEFAULT_CATEGORY_ICON = "payments";

export const CATEGORY_ICONS: Record<string, string> = {
  Jedzenie: "restaurant",
  Transport: "directions_car",
  Mieszkanie: "home",
  Zakupy: "shopping_cart",
  Zdrowie: "medical_services",
  Rozrywka: "theater_comedy",
  Edukacja: "academic_cap",

  Samorozwój: "person",

  Wynagrodzenie: "payments",
  Inwestycje: "investment",

  Inne: "category",
};

export const getCategoryIcon = (categoryName?: string | null): string => {
  if (!categoryName) return DEFAULT_CATEGORY_ICON;
  return CATEGORY_ICONS[categoryName] || DEFAULT_CATEGORY_ICON;
};
