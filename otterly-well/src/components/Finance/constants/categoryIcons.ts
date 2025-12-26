// temporraily using material icons here
export const DEFAULT_CATEGORY_ICON = "payments";

export const CATEGORY_ICONS: Record<string, string> = {
  Płatności: "payments",
  Transport: "directions_car",
  Jedzenie: "restaurant",
  Codzienne: "shopping_cart",
  Zdrowie: "medical_services",
  Dom: "home",
  Samorozwój: "person",
  Rozrywka: "theater_comedy",
  Oszczędności: "save",

  Wynagrodzenie: "payments",
  Inwestycje: "",
  Prezenty: "",

  Inne: "category",
};

export const getCategoryIcon = (categoryName?: string | null): string => {
  if (!categoryName) return DEFAULT_CATEGORY_ICON;
  return CATEGORY_ICONS[categoryName] || DEFAULT_CATEGORY_ICON;
};
