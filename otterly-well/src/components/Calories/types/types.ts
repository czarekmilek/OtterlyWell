export type Entry = {
  id: string;
  food_id?: string | null;
  name: string;
  kcal: number;
  grams: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type FoodHit = {
  id?: string;
  name: string;
  brand?: string;
  sourceId?: string;
  imageUrl?: string;
  kcalPer100g?: number;
  proteinPer100g?: number;
  fatPer100g?: number;
  carbsPer100g?: number;
};

export type FoodHitWithGrams = FoodHit & {
  listId: string;
  grams: number;
};
