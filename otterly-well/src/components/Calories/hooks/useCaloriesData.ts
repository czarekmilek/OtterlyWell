import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import type { Entry, FoodHit } from "../types/types";

export type GoalsState = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export function useCaloriesData(user: User | null, selectedDate: Date) {
  const [isLoading, setIsLoading] = useState(true);

  const [goals, setGoals] = useState<GoalsState>({
    calories: 2137,
    protein: 133,
    fat: 77,
    carbs: 255,
  });

  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (!user) return;

    async function loadData() {
      if (!user) return;

      setIsLoading(true);
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("goal_calories, goal_protein, goal_fat, goal_carbs")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) console.error("Error fetching profile", profileError);

      if (profileData) {
        setGoals((prev) => ({
          calories: profileData.goal_calories ?? prev.calories,
          protein: profileData.goal_protein ?? prev.protein,
          fat: profileData.goal_fat ?? prev.fat,
          carbs: profileData.goal_carbs ?? prev.carbs,
        }));
      }

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: entriesData, error: entriesError } = await supabase
        .from("calorie_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString())
        .order("created_at", { ascending: false });

      if (entriesError) console.error("Error fetching entries", entriesError);

      if (entriesData) {
        setEntries(entriesData);
      }
      setIsLoading(false);
    }

    loadData();
  }, [user, selectedDate]);

  const totalCalories = useMemo(
    () =>
      entries.reduce(
        (acc, e) => {
          acc.kcal += e.kcal;
          acc.protein += e.protein;
          acc.fat += e.fat;
          acc.carbs += e.carbs;
          return acc;
        },
        { kcal: 0, protein: 0, fat: 0, carbs: 0 }
      ),
    [entries]
  );

  async function addEntryFromFood(food: FoodHit, grams: number) {
    if (food.kcalPer100g == null) return; // if no calorie data from API we skip the product - user can add it manually in this case
    if (!user) return;

    let foodId = food.id;

    if (!foodId && food.sourceId) {
      const { data: existing } = await supabase
        .from("foods")
        .select("id")
        .eq("source_id", food.sourceId)
        .maybeSingle();

      // if food already exists in the db we use it, otherwise we create it to be fasterly fetched in the future for all users
      if (existing) {
        foodId = existing.id;
      } else {
        const { data: newFood, error: createError } = await supabase
          .from("foods")
          .insert({
            name: food.name,
            brand: food.brand,
            source: "openfoodfacts",
            source_id: food.sourceId,
            kcal_per_100g: food.kcalPer100g,
            protein_g_per_100g: food.proteinPer100g,
            fat_g_per_100g: food.fatPer100g,
            carbs_g_per_100g: food.carbsPer100g,
            image_url: food.imageUrl,
            serving_size_g: food.servingSize,
            serving_unit: food.servingUnit,
          })
          .select("id")
          .single();

        if (createError) {
          console.error("Error creating food", createError);
        } else if (newFood) {
          foodId = newFood.id;
        }
      }
    }

    const kcal = (food.kcalPer100g * grams) / 100;
    const protein = ((food.proteinPer100g ?? 0) * grams) / 100;
    const fat = ((food.fatPer100g ?? 0) * grams) / 100;
    const carbs = ((food.carbsPer100g ?? 0) * grams) / 100;

    const entryToInsert = {
      user_id: user.id,
      food_id: foodId || null,
      name: `${food.name} (${grams}g)`,
      kcal: Math.round(kcal),
      grams,
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs),
      created_at: selectedDate.toISOString(),
    };

    const { data: newEntry, error } = await supabase
      .from("calorie_entries")
      .insert(entryToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error inserting entry", error);
    } else if (newEntry) {
      setEntries((prev) => [newEntry, ...prev].sort((a, b) => b.kcal - a.kcal));
    }
  }

  const saveGoals = async (
    updates: Partial<{
      goal_calories: number;
      goal_protein: number;
      goal_fat: number;
      goal_carbs: number;
    }>
  ) => {
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      goal_calories: goals.calories,
      goal_protein: goals.protein,
      goal_fat: goals.fat,
      goal_carbs: goals.carbs,
      ...updates,
    });

    if (error) console.error("Error updating goals", error);
  };

  const updateGoal = (type: keyof GoalsState, value: number) => {
    const v = value > 0 ? value : 0;
    setGoals((prev) => ({ ...prev, [type]: v }));

    const dbField = `goal_${type}` as const;
    saveGoals({ [dbField]: v });
  };

  async function addCustomEntry(
    customEntry: Omit<Entry, "id">,
    saveData?: { servingName: string; servingWeight: number }
  ) {
    if (!user) return false;

    let foodId: string | null = null;

    if (saveData) {
      const { data: newFood, error: createError } = await supabase
        .from("foods")
        .insert({
          name: customEntry.name,
          source: "user",
          kcal_per_100g: customEntry.kcal,
          protein_g_per_100g: customEntry.protein,
          fat_g_per_100g: customEntry.fat,
          carbs_g_per_100g: customEntry.carbs,
          serving_size_g: saveData.servingWeight,
          serving_unit: saveData.servingName,
          created_by: user.id,
        })
        .select("id")
        .single();

      if (createError) {
        console.error("Error creating custom food", createError);
      } else if (newFood) {
        foodId = newFood.id;
      }
    }

    const entryToInsert = {
      ...customEntry,
      user_id: user.id,
      food_id: foodId,
      name: `${customEntry.name} (${customEntry.grams}g)`,
      created_at: selectedDate.toISOString(),
    };

    const { data: newEntry, error } = await supabase
      .from("calorie_entries")
      .insert(entryToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error inserting entry", error);
      return false;
    } else if (newEntry) {
      setEntries((prev) => [newEntry, ...prev].sort((a, b) => b.kcal - a.kcal));
      return true;
    }
    return false;
  }

  async function removeEntry(id: string) {
    const { error } = await supabase
      .from("calorie_entries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting entry", error);
      return;
    }

    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return {
    entries,
    isLoading,
    goals,
    totalCalories,
    addEntryFromFood,
    addCustomEntry,
    removeEntry,
    updateGoal,
  };
}
