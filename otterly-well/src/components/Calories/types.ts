export type Entry = {
  id: string;
  name: string;
  kcal: number;
  grams: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type FoodHit = {
  name: string;
  brand?: string;
  kcalPer100g?: number;
  proteinPer100g?: number;
  fatPer100g?: number;
  carbsPer100g?: number;
  imageUrl?: string;
  source: string;
  sourceId?: string;
};

export type FoodHitWithGrams = FoodHit & {
  id: string;
  grams: number;
};
