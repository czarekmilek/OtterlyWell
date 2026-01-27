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
    calories: 2370,
    protein: 120,
    fat: 72,
    carbs: 270,
  });

  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (!user) return;

    async function loadData() {
      if (!user) return;

      setIsLoading(true);
      const { data: goalsData, error: goalsError } = await supabase
        .from("nutrition_goals")
        .select(
          "daily_kcal_limit, daily_protein_goal, daily_fat_goal, daily_carbs_goal",
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (goalsError)
        console.error("Error fetching nutrition goals", goalsError);

      if (goalsData) {
        setGoals((prev) => ({
          calories: goalsData.daily_kcal_limit ?? prev.calories,
          protein: goalsData.daily_protein_goal ?? prev.protein,
          fat: goalsData.daily_fat_goal ?? prev.fat,
          carbs: goalsData.daily_carbs_goal ?? prev.carbs,
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
        { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      ),
    [entries],
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
            created_by: user.id,
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
      daily_kcal_limit: number;
      daily_protein_goal: number;
      daily_fat_goal: number;
      daily_carbs_goal: number;
    }>,
  ) => {
    if (!user) return;

    // upsert on user_id to create the record if it doesn't exist
    const { data: existing } = await supabase
      .from("nutrition_goals")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("nutrition_goals")
        .update(updates)
        .eq("id", existing.id);
      if (error) console.error("Error updating goals", error);
    } else {
      const { error } = await supabase.from("nutrition_goals").insert({
        user_id: user.id,
        daily_kcal_limit: goals.calories,
        daily_protein_goal: goals.protein,
        daily_fat_goal: goals.fat,
        daily_carbs_goal: goals.carbs,
        ...updates,
      });
      if (error) console.error("Error creating goals", error);
    }
  };

  const updateGoal = (type: keyof GoalsState, value: number) => {
    const v = value > 0 ? value : 0;
    setGoals((prev) => ({ ...prev, [type]: v }));

    const map: Record<keyof GoalsState, string> = {
      calories: "daily_kcal_limit",
      protein: "daily_protein_goal",
      fat: "daily_fat_goal",
      carbs: "daily_carbs_goal",
    };

    saveGoals({ [map[type]]: v });
  };

  async function addCustomEntry(
    customEntry: Omit<Entry, "id">,
    saveData?: { servingName: string; servingWeight: number },
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

  async function editEntry(id: string, updates: Partial<Entry>) {
    const { error } = await supabase
      .from("calorie_entries")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating entry", error);
      return;
    }

    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    );
  }

  return {
    entries,
    isLoading,
    goals,
    totalCalories,
    addEntryFromFood,
    addCustomEntry,
    removeEntry,
    editEntry,
    updateGoal,
  };
}
